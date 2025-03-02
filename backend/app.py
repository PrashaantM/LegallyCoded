from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import nltk
from nltk import word_tokenize, pos_tag, ne_chunk
from transformers import pipeline
from dotenv import load_dotenv
app = Flask(__name__, static_folder="../lexiai-frontend/build", static_url_path="")
CORS(app)

# Download required NLTK datasets
nltk.download("punkt")
nltk.download("maxent_ne_chunker")
nltk.download("words")

# Load HuggingFace model for GPT-style responses
openai_model = pipeline("text-generation", model="gpt-2")  # Use a local transformer model like GPT-2

# Example function to analyze text using NLTK
def analyze_text(text):
    # Tokenize the text and apply POS tagging
    tokens = word_tokenize(text)
    tagged_tokens = pos_tag(tokens)

    # Perform Named Entity Recognition
    tree = ne_chunk(tagged_tokens)
    
    # Extract entities from the tree
    entities = []
    for subtree in tree:
        if isinstance(subtree, nltk.Tree):  # If it's a subtree, it's an entity
            entity_name = " ".join([word for word, tag in subtree])
            entity_type = subtree.label()
            entities.append({
                "name": entity_name,
                "type": entity_type,
                "salience": 1.0  # Set salience to 1.0 for simplicity (since NLTK doesn't return salience)
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
