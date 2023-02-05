import sys
python = sys.executable
import rasa_nlu
import rasa_core
import spacy

# Import modules for training
from rasa_nlu.converters import load_data
from rasa_nlu.model import Trainer
from rasa_nlu import config

# loading the nlu training samples
training_data = load_data("nlu.md")
trainer = Trainer(config.load("config.yml"))

# training the nlu
interpreter = trainer.train(training_data)
model_directory = trainer.persist("./models/nlu", fixed_model_name="current")