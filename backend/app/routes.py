# backend/app/routes.py

from flask import Blueprint, jsonify

main = Blueprint('main', __name__)

@main.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask with Blueprint!"})

@main.route('/')
def home():
    return {'message': 'Flask backend is running!'}

