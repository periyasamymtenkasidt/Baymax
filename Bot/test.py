# import tensorflow as tf
# import numpy as np
# import joblib
# import json
# from flask import Flask, request, jsonify

# # 🔹 Load the trained model and encoders
# model = tf.keras.models.load_model("mlp_model.h5")
# encoder = joblib.load("label_encoder.pkl")
# scaler = joblib.load("scaler.pkl")
# mlb = joblib.load("mlb.pkl")  # MultiLabelBinarizer for symptoms

# app = Flask(__name__)

# # 🔹 API Route for Prediction
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()  # Get JSON input
#         symptoms = data.get("symptoms", [])

#         if not symptoms:
#             return jsonify({"error": "No symptoms provided"}), 400

#         # Transform symptoms into the model's input format
#         X_input = mlb.transform([symptoms])
#         X_input = scaler.transform(X_input)

#         # Predict the disease
#         predictions = model.predict(X_input)
#         predicted_class = np.argmax(predictions, axis=1)
#         disease_name = encoder.inverse_transform(predicted_class)[0]

#         return jsonify({"predicted_disease": disease_name})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # 🔹 Run the Flask API on localhost
# if __name__ == '__main__':
#     app.run(host="127.0.0.1", port=5000, debug=True)
import tensorflow as tf
print(tf.__version__)
