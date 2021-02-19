import sys
import os

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

from voice_cloning.voice_cloner import Voice_Cloner

import subprocess
import shlex
import time

app = Flask(__name__)
file_path = ""


if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    global file_path
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

    return file_path

@app.route('/script', methods=['GET', 'POST'])
def get_script():
    global file_path
    if request.method == 'POST':
        # Get the transcript from post request
        script = request.get_json()

        # Start the cloning process then synthesize speech using the script provided
        output_path = Voice_Cloner.sythesize_voice(file_path, script)
        response = jsonify({'audio_id': output_path})
        basepath = os.path.dirname(__file__)
        script_path = os.path.join(basepath,'silence_remover.sh')

        trimmed_output_path = os.path.join(
            basepath, 'static/cloned', secure_filename(time.strftime("%Y%m%d-%H%M%S") + "t.wav"))

    return response

@app.route('/record', methods=['POST'])
def save_audio():
    global file_path
    f = request.files['file']

    # Save the file to ./uploads
    basepath = os.path.dirname(__file__)
    file_path = os.path.join(
        basepath, 'uploads', secure_filename(f.filename))
    f.save(file_path)

    return 'Audio saved'

if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=True,host='0.0.0.0',ssl_context='adhoc')
