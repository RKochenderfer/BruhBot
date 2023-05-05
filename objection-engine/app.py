import json
from objection_engine.renderer import render_comment_list
from objection_engine.beans.comment import Comment
from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/ping')
def hello():
    return 'pong'

@app.route('/', methods=['POST'])
def render_messages():
    comments=[]
    loads = json.loads(request.data)
    messages, filename = loads['messages'], loads['file_name']
    for m in messages:
        comments.append(
            Comment(
                user_name=m['user_name'],
                text_content=m['text_content']
                )
        )
    filename='output/{}'.format(filename)
    render_comment_list(comment_list=comments, output_filename=filename)
    return Response(status=200)