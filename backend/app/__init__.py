# backend/app/__init__.py

from flask import Flask
from selenium import webdriver

def create_app():
    app = Flask(__name__)

    from .routes import main
    app.register_blueprint(main)

    return app
