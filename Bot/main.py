import os
import json
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain_ollama import OllamaLLM
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings

# 🔹 Load environment variables
load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

# 🔹 Initialize Flask app
app = Flask(__name__)

# 🔹 Load ML Model and Preprocessing Tools
try:
    model = tf.keras.models.load_model("mlp_model.h5")
    encoder = joblib.load("label_encoder.pkl")
    scaler = joblib.load("scaler.pkl")
    mlb = joblib.load("mlb.pkl")

    print("✅ Model & tools loaded")
except Exception as e:
    print(f"❌ Error loading model or tools: {e}")

# 🔹 Initialize Pinecone & LLM
index_name = "medibot"

def get_embeddings():
    cache_path = "./hf_cache/all-MiniLM-L6-v2"
    return HuggingFaceEmbeddings(model_name=cache_path)

try:
    embeddings = get_embeddings()
    docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings)
    retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})
    llm = OllamaLLM(model="llama3")

    print("✅ Pinecone & LLM initialized")
except Exception as e:
    print(f"❌ Error initializing Pinecone or LLM: {e}")

# 🔹 Define System Prompt for LLM
system_prompt = (
    "You are Baymax, an AI assistant providing medical treatment recommendations. "
    "Based on the retrieved medical context, suggest an appropriate treatment for the given disease. "
    "Provide a concise answer with a maximum of three sentences.\n\n"
    "Context:\n{context}\n\n"
    "Disease: {input}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

# 🔹 Create RAG Chain
treatment_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, treatment_chain)

# 🔹 Helper: Extract symptoms from sentence
def extract_symptoms_from_text(text, known_symptoms):
    text = text.lower()
    return [symptom for symptom in known_symptoms if symptom in text]

# 🔹 API Health Check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "API is running"}), 200

# 🔹 Prediction API (sentence-based)
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("🔹 Received Data:", data)

        input_text = data.get("sentence", "")
        if not input_text or not isinstance(input_text, str):
            return jsonify({"error": "Invalid input. Please provide a sentence."}), 400

        # Extract symptoms from sentence
        known_symptoms = [s.lower() for s in mlb.classes_]
        filtered_symptoms = extract_symptoms_from_text(input_text, known_symptoms)

        print("🔹 Extracted Symptoms:", filtered_symptoms)

        if not filtered_symptoms:
            return jsonify({"error": "No recognizable symptoms found in the sentence."}), 400

        # ML model prediction
        X_input = mlb.transform([filtered_symptoms])
        X_input = scaler.transform(X_input)
        predictions = model.predict(X_input)

        if predictions.shape[1] != len(encoder.classes_):
            return jsonify({"error": "Unexpected model output shape."}), 500

        predicted_class = np.argmax(predictions, axis=1)
        disease_name = encoder.inverse_transform(predicted_class)[0]

        print("🔹 Predicted Disease:", disease_name)

        # Query RAG for treatment
        response = rag_chain.invoke({"input": disease_name})
        treatment = response["answer"]

        return jsonify({
            "predicted_disease": disease_name,
            "extracted_symptoms": filtered_symptoms,
            "treatment_recommendation": treatment
        })

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

# 🔹 Run Server
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)

# import os
# import json
# import numpy as np
# import joblib
# import tensorflow as tf
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from langchain_pinecone import PineconeVectorStore
# from langchain_ollama import OllamaLLM
# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_community.embeddings import HuggingFaceEmbeddings

# # 🔹 Load environment variables
# load_dotenv()
# PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

# # 🔹 Initialize Flask app
# app = Flask(__name__)

# # 🔹 Load ML Model and Preprocessing Tools
# try:
#     model = tf.keras.models.load_model("mlp_model.h5")
#     encoder = joblib.load("label_encoder.pkl")
#     scaler = joblib.load("scaler.pkl")
#     mlb = joblib.load("mlb.pkl")  # MultiLabelBinarizer for symptoms

#     print("✅ Model loaded successfully")
#     print("✅ Label Encoder loaded successfully")
#     print("✅ Scaler loaded successfully")
#     print("✅ MultiLabelBinarizer loaded successfully")
# except Exception as e:
#     print(f"❌ Error loading model or encoders: {e}")

# # 🔹 Initialize Pinecone and LLM
# index_name = "medibot"

# def get_embeddings():
#     cache_path = "./hf_cache/all-MiniLM-L6-v2"  # Local model path
#     return HuggingFaceEmbeddings(model_name=cache_path)

# try:
#     embeddings = get_embeddings()
#     docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings)
#     retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})
#     llm = OllamaLLM(model="llama3")

#     print("✅ Pinecone & LLM initialized successfully")
# except Exception as e:
#     print(f"❌ Error initializing Pinecone or LLM: {e}")

# # 🔹 Define System Prompt for LLM
# system_prompt = (
#     "You are Baymax, an AI assistant providing medical treatment recommendations. "
#     "Based on the retrieved medical context, suggest an appropriate treatment for the given disease. "
#     "Provide a concise answer with a maximum of three sentences.\n\n"
#     "Context:\n{context}\n\n"
#     "Disease: {input}"
# )

# prompt = ChatPromptTemplate.from_messages([
#     ("system", system_prompt),
#     ("human", "{input}")
# ])

# # 🔹 Create Retrieval-Augmented Generation (RAG) Chain
# treatment_chain = create_stuff_documents_chain(llm, prompt)
# rag_chain = create_retrieval_chain(retriever, treatment_chain)

# # 🔹 API Health Check
# @app.route('/health', methods=['GET'])
# def health():
#     return jsonify({"status": "API is running"}), 200

# # 🔹 API Route for Prediction and Treatment Recommendation
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()
#         print("🔹 Received Data:", data)  # Debugging log

#         symptoms = data.get("symptoms", [])

#         # 🔸 Validate Input
#         if not isinstance(symptoms, list) or not symptoms:
#             return jsonify({"error": "Invalid input. Please provide a list of symptoms."}), 400

#         # 🔸 Filter Only Known Symptoms
#         valid_symptoms = set(mlb.classes_)
#         filtered_symptoms = [s for s in symptoms if s in valid_symptoms]

#         print("🔹 Filtered Symptoms:", filtered_symptoms)  # Debugging log

#         if not filtered_symptoms:
#             return jsonify({"error": "None of the provided symptoms are recognized."}), 400

#         # 🔸 Transform Input for ML Model
#         X_input = mlb.transform([filtered_symptoms])
#         X_input = scaler.transform(X_input)

#         # 🔸 Predict Disease
#         predictions = model.predict(X_input)

#         if predictions.shape[1] != len(encoder.classes_):
#             return jsonify({"error": "Unexpected model output shape."}), 500

#         predicted_class = np.argmax(predictions, axis=1)
#         disease_name = encoder.inverse_transform(predicted_class)[0]

#         print("🔹 Predicted Disease:", disease_name)  # Debugging log

#         # 🔸 Query Pinecone for Treatment Recommendations
#         response = rag_chain.invoke({"input": disease_name})
#         treatment = response["answer"]

#         return jsonify({
#             "predicted_disease": disease_name,
#             "treatment_recommendation": treatment
#         })

#     except Exception as e:
#         print("❌ Error:", str(e))  # Debugging log
#         return jsonify({"error": str(e)}), 500

# # 🔹 Run the Flask API
# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000, debug=False)  # Change host in production
