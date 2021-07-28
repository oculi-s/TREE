var _fi = document.getElementById('_fi');
var _cn = document.getElementById('_cn');
var _mu = document.getElementById('_mu');

function _file_check() {
    if (_fi.files.length == 0) {
        alert('No file uploaded')
    }
    else {
        var _file = _fi.files[0];
        _csv_to_table(_file);
    }
}

_cn.onclick = function(){
    if (_cn.checked){
        _mu.style.display = "block";
    }
    else{
        _mu.style.display = "none";
    };
};
