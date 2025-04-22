from flask import request

def setup_cors(app):
    """
    Configure CORS for the Flask app with comprehensive handling for preflight requests
    """
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            # Preflight request handling
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                'Access-Control-Max-Age': '3600'  # Cache preflight response for 1 hour
            }
            return '', 204, headers

    @app.after_request
    def after_request(response):
        # Add CORS headers to every response
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        
        # Enable credentials if needed later
        # response.headers.add('Access-Control-Allow-Credentials', 'true')
        
        return response 