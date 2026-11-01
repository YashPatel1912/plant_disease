from flask import Flask, current_app, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import RequestEntityTooLarge

from config import CORS_ORIGINS, LABELS_PATH, MAX_UPLOAD_MB, MODEL_PATH, PIXEL_SCALE, PORT
from image_utils import ImageValidationError, read_image
from model_service import PlantDiseaseModel


def error_response(message, status_code):
    return jsonify(success=False, error=message), status_code


def create_app():
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024
    CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}})

    app.config["PLANT_MODEL"] = PlantDiseaseModel(MODEL_PATH, LABELS_PATH, PIXEL_SCALE)

    @app.get("/api/health")
    def health():
        model = current_app.config["PLANT_MODEL"]
        return jsonify(
            success=True,
            status="ok",
            model_loaded=model is not None,
            labels_configured=model.labels_configured,
        )

    @app.post("/api/predict")
    def predict():
        if "image" not in request.files:
            return error_response("No image was uploaded. Send the file in the 'image' field.", 400)

        try:
            image = read_image(request.files["image"])
        except ImageValidationError as error:
            return error_response(str(error), 400)

        try:
            result = current_app.config["PLANT_MODEL"].predict(image)
        except Exception:
            app.logger.exception("Prediction failed")
            return error_response("The prediction could not be completed. Please try again.", 500)

        return jsonify(success=True, **result)

    @app.errorhandler(RequestEntityTooLarge)
    def file_too_large(_error):
        return error_response(f"The image is too large. The limit is {MAX_UPLOAD_MB} MB.", 413)

    @app.errorhandler(404)
    def not_found(_error):
        return error_response("This API endpoint does not exist.", 404)

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return error_response("This HTTP method is not allowed for this endpoint.", 405)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
