from flask import Flask
from flask_cors import CORS
from scraper_controller import scraper_bp

def create_app():
    app = Flask(__name__)

    # ✅ Allow only Angular frontend at localhost:4200
    CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

    # register blueprints
    app.register_blueprint(scraper_bp)

    return app
