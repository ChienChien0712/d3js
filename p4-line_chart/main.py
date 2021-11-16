import flask
from flask_cors import CORS
from flask import Flask


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
CORS(app)

@app.route('/')
def index():
    return flask.send_from_directory('./', 'main.html')



if __name__== '__main__':
    app.run(host='0.0.0.0', port=11666, debug=True)
