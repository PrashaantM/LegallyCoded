from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import spacy
from transformers import pipeline
import json
import nltk
from nltk.corpus import stopwords
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="../lexiai-frontend/build", static_url_path="")
CORS(app)

# Load spaCy model for entity recognition
nlp = spacy.load("en_core_web_sm")

# Load HuggingFace model for GPT-style responses
openai_model = pipeline("text-generation", model="gpt-2")  # Use a local transformer model like GPT-2

# Example function to analyze text using spaCy
def analyze_text(text):
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({
            "name": ent.text,
            "type": ent.label_,
            "salience": 1.0  # SpaCy doesn't provide salience, so setting it to 1.0 by default
        })
    return entities

# Generate a response using the local GPT-2 model
def get_openai_response(prompt):
    try:
        print("Generating response for:", prompt)
        response = openai_model(prompt, max_length=150, num_return_sequences=1)
        print("Generated Response:", response[0]["generated_text"])
        return response[0]["generated_text"]
    except Exception as e:
        print("Error generating response:", e)
        return "An error occurred while generating the response."

# Simulating a local case law search by loading a small case law dataset
def get_case_law(query):
    # Replace this with a real local dataset or a small collection of case law
    case_law_data = [
        {
            "title": "Smith v. Jones",
            "citation": "123 Ill. 456",
            "summary": "A case about contract law."
        },
        {
            "title": "Doe v. Roe",
            "citation": "456 Ill. 789",
            "summary": "A case about tort law."
        }
    ]
    # Simple mock search for cases containing the query
    filtered_cases = [case for case in case_law_data if query.lower() in case["title"].lower()]
    
    if not filtered_cases:
        return {"error": "No relevant case law found"}
    
    return filtered_cases

@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.static_folder, "static"), "favicon.ico")

@app.route("/api/query", methods=["GET"])
def legal_query():
    query = request.args.get("query")
    
    entities = analyze_text(query)
    
    ai_response = get_openai_response(query)
    
    return jsonify({
        "query": query,
        "entities": entities,
        "response": ai_response
    })

@app.route("/api/document", methods=["POST"])
def generate_document():
    data = request.get_json()
    document_type = data.get("document_type")
    content = f"Auto-generated {document_type} document based on input"
    return jsonify({"document": content})

@app.route("/api/case-law", methods=["GET"])
def case_law_search():
    query = request.args.get("query")
    
    case_law = get_case_law(query)
    
    return jsonify(case_law)

@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, "static"), path)

if __name__ == "__main__":
    # Download NLTK stopwords (if not already downloaded)
    nltk.download("stopwords")
    app.run(debug=True)
