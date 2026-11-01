import io
from pathlib import Path

import numpy as np
from PIL import Image, UnidentifiedImageError

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_FORMATS = {"JPEG", "PNG"}


class ImageValidationError(ValueError):
    pass


def read_image(file_storage):
    filename = file_storage.filename or ""
    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise ImageValidationError("Unsupported file type. Please upload a JPG, JPEG, or PNG image.")

    data = file_storage.read()
    if not data:
        raise ImageValidationError("The uploaded file is empty.")

    try:
        with Image.open(io.BytesIO(data)) as probe:
            image_format = probe.format
            probe.verify()
    except (UnidentifiedImageError, OSError, SyntaxError) as error:
        raise ImageValidationError("The uploaded file is not a valid image.") from error

    if image_format not in ALLOWED_FORMATS:
        raise ImageValidationError("Unsupported image format. Please upload a JPG, JPEG, or PNG image.")

    with Image.open(io.BytesIO(data)) as image:
        image.load()
        return image.convert("RGB")


def preprocess_image(image, input_size, pixel_scale):
    height, width = input_size
    resized = image.resize((width, height), Image.Resampling.LANCZOS)
    array = np.asarray(resized, dtype=np.float32) * pixel_scale
    return np.expand_dims(array, axis=0)
