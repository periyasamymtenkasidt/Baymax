import tensorflow as tf
import joblib

try:
    model = tf.keras.models.load_model("mlp_model.h5", compile=False)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")

try:
    encoder = joblib.load("label_encoder.pkl")
    print("✅ Label Encoder loaded successfully")
except Exception as e:
    print(f"❌ Error loading Label Encoder: {e}")

try:
    scaler = joblib.load("scaler.pkl")
    print("✅ Scaler loaded successfully")
except Exception as e:
    print(f"❌ Error loading Scaler: {e}")

try:
    mlb = joblib.load("mlb.pkl")
    print("✅ MultiLabelBinarizer loaded successfully")
except Exception as e:
    print(f"❌ Error loading MultiLabelBinarizer: {e}")
