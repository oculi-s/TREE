var _ot = document.getElementById('_ot')
var _data;
var _array = [];

function _csv_to_table(_file) {
    var _reader = new FileReader();
    _reader.readAsText(_file, 'UTF-8');
    _reader.onload = function(e){
        _csv_parser(_reader.result);
    };
};

function _csv_parser(d){
    _data = d.split('\r\n');
    _data.forEach(function(e) {
        _row = e.split(',');
        _array.push(_row);
    });
    console.log(_array);
    _ot.innerText = _array[0][0];
};