import json
import shutil
import requests
import uuid
import os
from objection_engine.renderer import render_comment_list
from objection_engine.beans.comment import Comment
from flask import Flask, request, Response
from pathlib import Path
from threading import Thread

app = Flask(__name__)

@app.route('/ping')
def hello():
    return 'pong'

@app.route('/', methods=['POST'])
def render_messages():
    comments=[]
    loads = json.loads(request.data)
    messages, filename = loads['messages'], loads['file_name']
    download_all_attachments(messages)

    for m in messages:
        if 'attachment_file_path' in m and m['text_content'].strip():
            comments.append(
                Comment(
                    user_name=m['user_name'],
                    text_content=m['text_content'],
                    evidence_path=m['attachment_file_path']
                    )
            )
        elif 'attachment_file_path' in m and not m['text_content'].strip():
            comments.append(
                Comment(
                    user_name=m['user_name'],
                    text_content='(image)',
                    evidence_path=m['attachment_file_path']
                    )
            )
        else:
            print('no attachment')
            comments.append(
                Comment(
                    user_name=m['user_name'],
                    text_content=m['text_content'],
                    )
            )

    filename='output/{}'.format(filename)
    render_comment_list(comment_list=comments, output_filename=filename)
    cleanup_temp_imgs(messages)
    return Response(status=200)

def download_all_attachments(messages):
    """
    Pre-downloads all attachments and attaches them to their message
    """
    threads = []
    for m in messages:
        thread = Thread(target=process_attachment, args=(m, ))
        thread.start()
        threads.append(thread)
    
    for t in threads:
        t.join()
        pass


def process_attachment(message):
    if 'attachment_url' not in message or message['attachment_url'] == None:
        return
    print('processing url: ', message['attachment_url'])
    message['attachment_file_path'] = download_attachment(message['attachment_url'])


def download_attachment(url):
    """
    Downloads the attachment from the url, saves it to a temporary location, 
    and returns the path string
    """
    Path("./temp_imgs").mkdir(exist_ok=True)
    print('starting download')
    file_name = './temp_imgs/' + str(uuid.uuid4())
    res = requests.get(url, stream = True)
    if res.status_code == 200:
        with open(file_name, 'wb') as f:
            shutil.copyfileobj(res.raw, f)
        print('Image successfully Downloaded: ', file_name, ' From url: ', url)
        return file_name
    else:
        print('Image couldn\'t be retrieved')
    return None

def cleanup_temp_imgs(messages):
    print('starting cleanup')
    paths = []
    for m in messages:
        if 'attachment_file_path' in m and m['attachment_file_path'] is not None:
            paths.append(m['attachment_file_path'])
    # delete_temp_imgs(paths)
    thread = Thread(target = delete_temp_imgs, args = (paths, ))
    thread.start()

def delete_temp_imgs(paths: list):
    """
    Delete the imgs at the path urls
    """
    for p in paths:
        print('deleting: ', p)
        os.remove(p)