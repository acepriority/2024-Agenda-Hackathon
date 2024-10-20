from fastapi import FastAPI, File, UploadFile, HTTPException
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import logging
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

INPUT_SHAPE = (224, 224)
MODEL_PATH = r'C:\Users\HP\Desktop\saved_model\ResNet50V2_2.h5'


def load_model(MODEL_PATH):
    return tf.keras.models.load_model(MODEL_PATH)


model = load_model(MODEL_PATH)


def read_image(image_encoded):
    try:
        pil_image = Image.open(BytesIO(image_encoded))
        return pil_image
    except Exception as e:
        logging.error(f"Error reading image: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid image format")


def preprocess_image(pil_image):
    try:
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        input_image = np.array(pil_image)
        input_image = np.array(pil_image.resize(INPUT_SHAPE))
        input_image = input_image / 255.0
        input_image = np.expand_dims(input_image, axis=0)
        return input_image
    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


def predict_image(model, preprocessed_image):
    try:
        predictions = model.predict(preprocessed_image)
        predicted_class = np.argmax(predictions, axis=-1)
        predicted_class_prob = np.max(predictions)

        class_labels = ['Becterial Blight in Rice', 'Rice Blast', 'Wheat___Yellow_Rust', 'maize fall armyworm']

        return {
            "predicted_class": class_labels[predicted_class[0]],
            "probability": f"{predicted_class_prob:.2f}"
        }
    except Exception as e:
        logging.error(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail="Error during prediction")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        pil_image = read_image(await file.read())
        image = preprocess_image(pil_image)
        logging.info(f"Input Image Size: {pil_image.size}")

        prediction = predict_image(model, image)
        logging.info(f"Prediction: {prediction}")

        return prediction

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
