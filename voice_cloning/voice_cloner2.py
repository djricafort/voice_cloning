from voice_cloning.synthesizer.inference import Synthesizer
from voice_cloning.encoder import inference as encoder
from voice_cloning.vocoder import inference as vocoder
from pathlib import Path
import numpy as np
import librosa
import sys
import os



class Voice_Cloner2():

    def __init__(self):
        self = self


    def sythesize_voice(source_voice, script):

        ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

        encoder_weights = Path(ROOT_DIR + "/" + "encoder/saved_models/pretrained.pt")
        vocoder_weights = Path(ROOT_DIR + "/" + "vocoder/saved_models/pretrained/pretrained.pt")
        syn_dir = Path(ROOT_DIR + "/" + "synthesizer/saved_models/logs-pretrained/taco_pretrained")
        encoder.load_model(encoder_weights)
        synthesizer = Synthesizer(syn_dir)
        vocoder.load_model(vocoder_weights)

        in_fpath = source_voice
        preprocessed_wav = encoder.preprocess_wav(in_fpath)
        original_wav, sampling_rate = librosa.load(in_fpath)
        preprocessed_wav = encoder.preprocess_wav(original_wav, sampling_rate)
        embed = encoder.embed_utterance(preprocessed_wav)
        print("Synthesizing new audio...")

        text = script

        # The synthesizer works in batch, so you need to put your data in a list or numpy array
        # texts = [text]
        # embeds = [embed]
        num_generated = 0
        try:
            # with io.capture_output() as captured:
            specs = synthesizer.synthesize_spectrograms([text], [embed])
            # spec = specs[0]
            print("Created the mel spectrogram")
            generated_wav = vocoder.infer_waveform(specs[0])
            generated_wav = np.pad(generated_wav, (0, synthesizer.sample_rate), mode="constant")

            fpath = "static/cloned/demo_output_%02d.wav" % num_generated
            print(generated_wav.dtype)
            librosa.output.write_wav(fpath, generated_wav,
                                     synthesizer.sample_rate)
            # num_generated += 1

        except Exception as e:
            print("Caught exception: %s" % repr(e))
            print("Restarting\n")

        return fpath
