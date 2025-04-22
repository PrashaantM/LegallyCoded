from flask import Blueprint, request, jsonify # type: ignore
from werkzeug.security import generate_password_hash, check_password_hash # type: ignore
from database.db import init_db, User

auth_bp = Blueprint('auth', __name__)
db_session = init_db()

# Handle OPTIONS requests explicitly in this blueprint
@auth_bp.route('/register', methods=['OPTIONS'])
@auth_bp.route('/login', methods=['OPTIONS'])
def handle_auth_options():
    return '', 204

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user exists
    existing_user = db_session.query(User).filter(
        (User.username == data.get('username')) | 
        (User.email == data.get('email'))
    ).first()
    
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 400
    
    # Create new user
    new_user = User(
        username=data.get('username'),
        email=data.get('email'),
        password_hash=generate_password_hash(data.get('password'))
    )
    
    db_session.add(new_user)
    db_session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = db_session.query(User).filter_by(username=data.get('username')).first()
    
    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({"error": "Invalid username or password"}), 401
    
    # In a real app, you would generate a JWT token here
    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    }), 200 