from flask import Flask, render_template, request, redirect
from tree import get_tree_data
from anytree import RenderTree
import os

template_path = os.path.dirname('__file__')
app = Flask(__name__,  template_folder=template_path)

@app.route('/')
def main(data=None):
    return render_template('main.html', data=None)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file(data=None):
    if request.method == 'POST':
        mylist = request.files.getlist('uploaded_file')
        if not mylist or not any(f for f in mylist):
            return redirect('/')
        else:
            myfile = request.files['uploaded_file']
            mynode = get_tree_data(myfile, request.form.get('attr_law'))
            if not request.form.get('attr_name'):
                myattr = 'name'
            else:
                myattr = 'None'
            return render_template('main.html', data=RenderTree(mynode).by_attr(myattr))

if __name__ == '__main__':
    app.run(debug=True)
