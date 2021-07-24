var _file_input = document.getElementById('_file_input')

function _file_check() {
    if (_file_input.files.length == 0) {
        alert('No file uploaded')
    }
    else {
        var _file = _file_input.files[0];
        _csv_to_table(_file);
    }
}