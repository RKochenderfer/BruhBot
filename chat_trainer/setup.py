"""
Chat Trainer setup file
"""

import os
from setuptools import setup

current_directory = os.path.dirname(os.path.abspath(__file__))

REQUIREMENTS = []
DEPENDENCIES = []

with open('requirements.txt') as requirements:
    for requirement in requirements.readlines():
        if requirement.startswith('git+git://'):
            DEPENDENCIES.append(requirement)
        else:
            REQUIREMENTS.append(requirement)

setup(
    name='chat_trainer',
    version='0.1',
    description='A chat trainer application',
    author='Ray Kochenderfer',
    install_requires=REQUIREMENTS
)