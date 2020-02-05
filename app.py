import sys
import os

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

from voice_cloning.voice_cloner import Voice_Cloner
from voice_cloning.voice_cloner2 import Voice_Cloner2

app = Flask(__name__)
file_path = ""

# sample_script = "An old man lived in the village. \n He was one of the most unfortunate people in the world."
# sample_script = "this is just a sample script. \n it has multiple lines for testing"
sample_script = "Ours is not a drive for power, but purely a nonviolent fight for India’s independence. \n In a violent struggle, a successful general has been often known to effect a military coup and to set up a dictatorship. \n But under the Congress scheme of things, essentially nonviolent as it is, there can be no room for dictatorship."

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
        # sample_script = script.replace(".", ".\n")
        # sample_script = sample_script.replace(".", ".\n")
        print("TEST123")
        print(script)
        print(sample_script)
        output_path = Voice_Cloner.sythesize_voice(file_path, script)
        response = jsonify({'audio_id': output_path})
        print(output_path)

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
