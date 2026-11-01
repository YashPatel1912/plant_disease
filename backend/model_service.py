import json
from pathlib import Path

import numpy as np
import tensorflow as tf

from image_utils import preprocess_image


def load_class_labels(labels_path, expected_count):
    path = Path(labels_path)
    if not path.exists():
        return None

    with path.open(encoding="utf-8") as file:
        labels = json.load(file)

    if not isinstance(labels, list) or not all(isinstance(label, str) for label in labels):
        raise ValueError(f"{path} must contain a JSON array of class name strings.")
    if len(labels) != expected_count:
        raise ValueError(
            f"{path} lists {len(labels)} classes but the model outputs {expected_count}."
        )
    return labels


class PlantDiseaseModel:
    def __init__(self, model_path, labels_path, pixel_scale):
        self.model = tf.keras.models.load_model(model_path, compile=False)
        _, height, width, _ = self.model.input_shape
        self.input_size = (int(height), int(width))
        self.pixel_scale = pixel_scale
        self.labels = load_class_labels(labels_path, int(self.model.output_shape[-1]))

    @property
    def labels_configured(self):
        return self.labels is not None

    def predict(self, image):
        batch = preprocess_image(image, self.input_size, self.pixel_scale)
        probabilities = self.model.predict(batch, verbose=0)[0]
        class_index = int(np.argmax(probabilities))
        confidence = round(float(probabilities[class_index]) * 100, 2)

        if self.labels is None:
            return {
                "prediction": f"Class {class_index}",
                "confidence": confidence,
                "status": "Unknown",
                "class_index": class_index,
                "labels_configured": False,
            }

        label = self.labels[class_index]
        return {
            "prediction": label,
            "confidence": confidence,
            "status": "Healthy" if "healthy" in label.lower() else "Diseased",
            "class_index": class_index,
            "labels_configured": True,
        }
