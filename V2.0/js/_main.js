var _fi = document.getElementById('_fi')

function _file_check() {
    if (_fi.files.length == 0) {
        alert('No file uploaded')
    }
    else {
        var _file = _fi.files[0];
        _csv_to_table(_file);
    }
}

