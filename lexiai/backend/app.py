from flask import Flask, jsonify, request # type: ignore
from flask_cors import CORS # type: ignore
import os
from dotenv import load_dotenv # type: ignore
from api.auth import auth_bp
from api.search import search_bp
from api.documents import documents_bp
from api.cases import cases_bp
from database.db import init_db
from middlewares import setup_cors

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Use our custom CORS middleware instead of flask-cors
# CORS(app, resources={r"/*": {"origins": "*"}})
setup_cors(app)

# Initialize database
init_db()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(search_bp, url_prefix='/api/search')
app.register_blueprint(documents_bp, url_prefix='/api/documents')
app.register_blueprint(cases_bp, url_prefix='/api/cases')

# Our custom middleware already handles the after_request, so we can remove this
# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#     return response

@app.route('/')
def index():
    return jsonify({"message": "Welcome to LexiAI API"})

if __name__ == '__main__':
    app.run(debug=True) 