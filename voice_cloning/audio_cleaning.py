import librosa
from pysndfx import AudioEffectsChain
import numpy as np
import math
# import python_speech_features
import scipy as sp
from scipy import signal

class Audio_Cleaner():
    

    def trim_silence(y):
        y_trimmed, index = librosa.effects.trim(y, top_db=20, frame_length=2, hop_length=500)
        trimmed_length = librosa.get_duration(y) - librosa.get_duration(y_trimmed)
        print("trimmed_length = ")
        print(trimmed_length)

        return y_trimmed, trimmed_length

    def reduce_noise_centroid_mb(y, sr):

        cent = librosa.feature.spectral_centroid(y=y, sr=sr)

        threshold_h = np.max(cent)
        threshold_l = round(np.median(cent)) #*0.1
        try:
            less_noise = AudioEffectsChain().lowshelf(gain=-30.0, frequency=threshold_l, slope=0.5).highshelf(gain=-30.0, frequency=threshold_h, slope=0.5).limiter(gain=10.0)
    
            y_cleaned = less_noise(y)


            cent_cleaned = librosa.feature.spectral_centroid(y=y_cleaned, sr=sr)
            columns, rows = cent_cleaned.shape
            boost_h = math.floor(rows/3*2)
            boost_l = math.floor(rows/6)
            boost = math.floor(rows/3)

            # boost_bass = AudioEffectsChain().lowshelf(gain=20.0, frequency=boost, slope=0.8)
            boost_bass = AudioEffectsChain().lowshelf(gain=16.0, frequency=boost_h, slope=0.5)#.lowshelf(gain=-20.0, frequency=boost_l, slope=0.8)
            y_clean_boosted = boost_bass(y_cleaned)

            print("noise reduce successful")

        except Exception as e:
            print("Caught exception: %s" % repr(e))

        return y_clean_boosted
