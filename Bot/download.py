from sentence_transformers import SentenceTransformer
import os

# Define the cache path
cache_path = "./hf_cache/all-MiniLM-L6-v2"

# Ensure the folder exists
os.makedirs(cache_path, exist_ok=True)

# Load and save the model locally
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
model.save(cache_path)

print(f"✅ Model saved at: {cache_path}")
