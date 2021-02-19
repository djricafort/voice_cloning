# voice_cloning
A webapp for cloning voice based from this [repo](https://github.com/CorentinJ/Real-Time-Voice-Cloning)

## How to use:
1. Install the dependencies found in `requirements.txt`
2. Download the pretrained models from [here](https://github.com/CorentinJ/Real-Time-Voice-Cloning/wiki/Pretrained-models) and save it to their respective directories
3. Run `app.py`
4. Record or upload the voice you want to be cloned. The audio will be saved in `uploads` directory
5. Enter the script that you want the voice to speak
6. Play or download the synthesized audio. Synthesized audio will be stored in `static/cloned/` directory

* uses `SoX` shell script to remove the silent part from the synthesized audio
