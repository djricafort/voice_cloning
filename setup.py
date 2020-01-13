#!/usr/bin/env python

from distutils.core import setup

files = ["voice_cloning/*", "encoder/*", "encoder/saved_models/*", "synthesizer/*", "synthesizer/saved_models/logs-pretrained/taco_pretrained/*", "vocoder/saved_models/pretrained/*", "toolbox/*", "utils/*"]

setup(name='voice_cloning',
      version='0.0.1',
      include_package_data=True,
      description='Voice Cloning API',
      author='',
      url='',
      # packages=find_packages(),
      packages=['voice_cloning',
      'voice_cloning.encoder',
      'voice_cloning.encoder.data_objects',
      'voice_cloning.encoder.saved_models',
      'voice_cloning.synthesizer',
      'voice_cloning.synthesizer.models',
      'voice_cloning.synthesizer.saved_models.logs-pretrained.taco_pretrained',
      'voice_cloning.synthesizer.utils',
      'voice_cloning.toolbox',
      'voice_cloning.utils',
      'voice_cloning.vocoder',
      'voice_cloning.vocoder.models',
      'voice_cloning.vocoder.saved_models.pretrained'],
      package_data = {'voice_cloning' : files },
      install_requires=['tensorflow-gpu>=1.10.0,<=1.14.0',
                        'umap-learn',
                        'visdom',
                        'webrtcvad',
                        'librosa>=0.5.1',
                        'matplotlib>=2.0.2',
                        'scipy>=1.0.0',
                        'tqdm',
                        'sounddevice',
                        'Unidecode',
                        'inflect',
                        'PyQt5',
                        'multiprocess',
                        'numba',
                        'torch']
      )
