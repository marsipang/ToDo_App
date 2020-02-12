import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'example-secret-key-demo'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres@localhost:5432/todoapp'
    SQLALCHEMY_TRACK_MODIFICATIONS = False