import os
import configparser
from distutils.core import setup

config = configparser.ConfigParser()

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
    name='ChatTrainer',
    version='1.0',
    description='A chat trainer',
    author='Ray Kochenderfer',
    author_email='rayjkochenderfer@gmail.com',
    install_requires=REQUIREMENTS,
    dependency_links=DEPENDENCIES
    test_suite='tests'
)
