import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from scraper_controller import scraper_bp
from scrape_details import details_bp

# --- Paths ---
BASE = os.path.dirname(os.path.abspath(__file__))
ANGULAR_DIST = os.path.join(BASE, "../dist/flp-1/browser")

print("BASE:", BASE)
print("Angular dist exists:", os.path.exists(ANGULAR_DIST))
print("Index.html exists:", os.path.exists(os.path.join(ANGULAR_DIST, "index.html")))

def create_app():
    app = Flask(
        __name__,
        static_folder=None  # disable Flask's automatic static route
    )

    # Allow frontend to call API endpoints
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register your API blueprints
    app.register_blueprint(scraper_bp)
    app.register_blueprint(details_bp)

    # --- Catch-all route for Angular SPA ---
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        full_path = os.path.join(ANGULAR_DIST, path)
        if path != "" and os.path.exists(full_path):
            print("Serving static file:", path)
            return send_from_directory(ANGULAR_DIST, path)
        print("Serving Angular index.html for path:", path)
        return send_from_directory(ANGULAR_DIST, "index.html")

    return app

# Optional: debug route listing
if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        print("📍 Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint:30s} -> {rule}")
