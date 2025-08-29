# scraper_controller.py
from flask import Blueprint, request, jsonify
from scrape_service import scrape_data

scraper_bp = Blueprint("scraper", __name__)

@scraper_bp.route("/scrape", methods=["POST"])
def scrape():
    data = request.get_json()
    query_type = data.get("type")
    query_value = data.get("value")

    if not query_type or not query_value:
        return jsonify({"error": "Missing type or value"}), 400

    results = scrape_data(query_type, query_value)
    return jsonify({
        "query_type": query_type,
        "query_value": query_value,
        "results": results
    })
