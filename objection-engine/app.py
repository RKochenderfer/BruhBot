import json
from objection_engine.renderer import render_comment_list
from objection_engine.beans.comment import Comment
from flask import Flask, request, jsonify
from time import gmtime, strftime

app = Flask(__name__)

@app.route('/ping')
def hello():
    return 'pong'

@app.route('/', methods=['POST'])
def render_messages():
    comments=[]
    messages=json.loads(request.data)['messages']
    for m in messages:
        comments.append(
            Comment(
                user_name=m['user_name'],
                text_content=m['text_content']
                )
        )
    timestamp=strftime("%Y-%m-%d_%H-%M-%S", gmtime())
    render_comment_list(comment_list=comments, output_filename='output/output-{}.mp4'.format(timestamp))
    Flask.send
    return jsonify(messages)