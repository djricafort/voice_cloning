import sys
import os
# import glob
# import re
# import numpy as np

# Keras
# from keras.applications.imagenet_utils import preprocess_input, decode_predictions
# from keras.models import load_model
# from keras.preprocessing import image

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

from voice_cloning.voice_cloner import Voice_Cloner

app = Flask(__name__)
file_path = ""

if not os.path.exists('uploads'):
    os.makedirs('uploads')


@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')

@app.route('/clone', methods=['GET', 'POST'])
def upload():
    global file_path
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']


        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        print(file_path)
        f.save(file_path)

    return file_path

@app.route('/script', methods=['GET', 'POST'])
def get_script():
    if request.method == 'POST':
        # Get the transcript from post request
        script = request.get_json()
        print(script)
        print(file_path)

        output_path = Voice_Cloner.sythesize_voice(file_path, script)
        response = jsonify({'audio_id': output_path})

    return response

if __name__ == '__main__':
    app.run(debug=True)
