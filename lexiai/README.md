# LexiAI - Legal Assistant

LexiAI is an AI-powered legal assistant that helps users with case law research, legal Q&A, and contract drafting using NLP. This application provides summarized case law, answers to legal queries, and auto-generates legal documents based on user input.

## Features

- **Legal Q&A**: Ask legal questions in natural language and receive AI-generated responses
- **Case Law Research**: Search and browse case law with filtering options
- **Document Generator**: Create legal documents like NDAs, contracts, and more using AI assistance
- **User Authentication**: Secure login/registration system for saving documents and search history

## Tech Stack

- **Frontend**: React, React Bootstrap
- **Backend**: Flask
- **AI Models**: OpenAI GPT, Google NLP
- **Database**: SQLite

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- API keys for:
  - OpenAI
  - Google Cloud NLP (optional)
  - Harvard Case Law API (optional)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd lexiai/backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Edit the `.env` file to add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   CASE_LAW_API_KEY=your_case_law_api_key_here
   ```

6. Start the backend server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd lexiai/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Legal Q&A

- `POST /api/search/query` - Ask a legal question

### Case Law

- `GET /api/cases/search` - Search for relevant cases
- `GET /api/cases/:id` - Get case details

### Documents

- `GET /api/documents/types` - Get available document types
- `GET /api/documents/parameters/:type` - Get parameters for a document type
- `POST /api/documents/generate` - Generate a document
- `GET /api/documents/user/:id` - Get all documents for a user
- `GET /api/documents/:id` - Get a specific document

## Contributors

- Sanay, Mustafa - Frontend UI
- Jessica - Backend API, Legal Document Generator
- Prashaant - AI Model Setup, Legal Document Generator

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

LexiAI is designed to assist with legal research and document creation, but it should not be considered legal advice. Please consult with a qualified legal professional for specific legal matters. 