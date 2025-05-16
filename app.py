from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Vue에서 오는 요청 허용

# 임시 사용자 정보 (나중에 DB로 대체 가능)
dummy_users = {
    "test@example.com": "1234"
}

@app.route('/')
def home():
    return 'This is Home!'

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email in dummy_users and dummy_users[email] == password:
        return jsonify({"success": True, "message": "로그인 성공"})
    else:
        return jsonify({"success": False, "message": "이메일 또는 비밀번호가 틀렸습니다"}), 401

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
