from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="../lexiai-frontend/build", static_url_path="")
CORS(app)

@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.static_folder, "static"), "favicon.ico")

@app.route("/api/query", methods=["GET"])
def legal_query():
    query = request.args.get("query")
    response = f"Answering legal query: {query}"
    return jsonify({"response": response})

@app.route("/api/document", methods=["POST"])
def generate_document():
    data = request.get_json()
    document_type = data.get("document_type")
    content = f"Auto-generated {document_type} document based on input"
    return jsonify({"document": content})

@app.route("/api/case-law", methods=["GET"])
def case_law_search():
    query = request.args.get("query")
    results = [
        {"title": "Case Law 1", "summary": "Summary of case law 1"},
        {"title": "Case Law 2", "summary": "Summary of case law 2"},
    ]
    return jsonify(results)

@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, "static"), path)

if __name__ == "__main__":
    app.run(debug=True)
