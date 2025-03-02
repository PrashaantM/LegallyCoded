from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../lexiai-frontend/build", static_url_path="")
CORS(app)

# Home route
@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

# Favicon handler (Prevents 404 errors)
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.static_folder, "static"), "favicon.ico")

# Legal query handler (Modify this for AI integration)
@app.route("/api/query", methods=["GET"])
def legal_query():
    query = request.args.get("query")  # Retrieve the query parameter from the front-end
    # Here you would integrate NLP for actual legal query processing
    response = f"Answering legal query: {query}"
    return jsonify({"response": response})

# Route to generate legal documents (modify for auto-generation logic)
@app.route("/api/document", methods=["POST"])
def generate_document():
    data = request.get_json()  # Get the data sent from the front-end
    document_type = data.get("document_type")
    content = f"Auto-generated {document_type} document based on input"
    return jsonify({"document": content})

# Serving React's static files
@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, "static"), path)

if __name__ == "__main__":
    app.run(debug=True)
