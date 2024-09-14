# app.py
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all origins, configure as needed

# Sample data for demonstration
balls = [
    {"id": 1, "color": "red"},
    {"id": 2, "color": "blue"}
]

@app.route('/api/balls', methods=['GET'])
def get_balls():
    return jsonify(balls)

if __name__ == '__main__':
    app.run(debug=True)
