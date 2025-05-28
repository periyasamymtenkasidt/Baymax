import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder, StandardScaler
import joblib

# 🔹 Load dataset
df = pd.read_csv("dataset.csv")  # Change path if needed
df.fillna('', inplace=True)  # Handle missing values

# 🔹 Extract disease & symptoms
disease_column = "Disease"
symptom_columns = df.columns[1:]  # All columns except "Disease"

# 🔹 Convert symptoms into a list per row
df["Symptoms"] = df[symptom_columns].apply(lambda x: list(filter(lambda y: y != '', x)), axis=1)

# 🔹 One-hot encode symptoms using MultiLabelBinarizer
mlb = MultiLabelBinarizer()
X = mlb.fit_transform(df["Symptoms"])

# 🔹 Encode disease labels
encoder = LabelEncoder()
y = encoder.fit_transform(df[disease_column])

# 🔹 Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 🔹 Normalize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 🔹 Define Optimized MLP Model
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    keras.layers.Dropout(0.3),  # Reduce overfitting
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(len(encoder.classes_), activation='softmax')  # Dynamic output layer
])

# 🔹 Compile Model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# 🔹 Train Model with Early Stopping
early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
history = model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test), callbacks=[early_stop])

# 🔹 Evaluate Model
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"✅ Model Accuracy: {test_acc * 100:.2f}%")

# 🔹 Save Model
model.save("mlp_model.h5")
print("✅ Optimized Model saved successfully as 'mlp_model.h5'!")

# 🔹 Save Label Encoder & Scaler
joblib.dump(encoder, "label_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(mlb, "mlb.pkl")  # Save symptom encoder
print("✅ Encoders saved successfully!")
