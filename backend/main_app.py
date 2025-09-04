import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from scraper_controller import scraper_bp

BASE = os.path.dirname(os.path.abspath(__file__))   # <-- put BASE back
ANGULAR_DIST = os.path.join(BASE, "../dist/flp-1/browser")

print("BASE:", BASE)
print("Angular dist exists:", os.path.exists(ANGULAR_DIST))
print("Index.html exists:", os.path.exists(os.path.join(ANGULAR_DIST, "index.html")))

def create_app():
    app = Flask(
        __name__,
        static_folder=ANGULAR_DIST,
        static_url_path=""
    )

    # Only allow Angular frontend for API requests
    CORS(app, resources={
        r"/scrape/*": {"origins": "*"},
        r"/search*": {"origins": "*"}   # <-- add this
    })


    # Register API blueprint
    app.register_blueprint(scraper_bp)

    # Catch-all route to serve Angular
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        full_path = os.path.join(app.static_folder, path)
        if path != "" and os.path.exists(full_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
