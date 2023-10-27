import flask
from flask import Flask
from barcode import Code128
from barcode.writer import ImageWriter

app = Flask(__name__)

@app.route('/')
def home():
    studentID = flask.request.args.get('studentID')
    barc = Code128(studentID, writer= ImageWriter())
    barc.save("./static/barcode")

    return f'<img src="/static/barcode.png"></img>'

if __name__ == '__main__':
    app.run(port=3000,debug=True)