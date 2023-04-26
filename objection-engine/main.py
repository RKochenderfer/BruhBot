import json
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/ping')
def hello():
    return 'pong'

@app.route('/', methods=['POST'])
def render_messages():
    messages = json.loads(request.data)
    return jsonify(messages)