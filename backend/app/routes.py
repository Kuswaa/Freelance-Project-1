# app/routes.py
from flask import Blueprint, request, jsonify
from .scraper import run_scraper

routes = Blueprint("routes", __name__)

@routes.route("/scrape", methods=["POST"])
def scrape():
    data = request.json
    search_type = data.get("type")   # "name", "id", "phone", "plate"
    search_value = data.get("value")

    if not search_type or not search_value:
        return jsonify({"error": "Missing type or value"}), 400

    try:
        results = run_scraper(search_type, search_value)
        return jsonify({
            "query_type": search_type,
            "query_value": search_value,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
