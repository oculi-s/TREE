from flask import Flask, render_template, request
from tree import get_tree_data
import os

template_path = os.path.dirname(__file__)
app = Flask(__name__,  template_folder=template_path)

@app.route('/')
def main(data=None):
    return render_template('main.html',data=None)

@app.route('/upload', methods = ['GET', 'POST'])
def upload_file(data=None):
    if request.method == 'POST':
        myfile = request.files['uploaded_file']
    #clipboard.copy(get_tree_data(myfile))
    return render_template('main.html',data=get_tree_data(myfile))

if __name__ == '__main__':
    app.run(debug=True)