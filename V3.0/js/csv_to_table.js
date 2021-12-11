const _ot = document.getElementById('_ot')
var string;
_r = new FileReader();

function _csv_to_table(_file) {
    string = '';
    _r.readAsText(_file, 'UTF-8');
    _r.onload = function(_s) {
        _d = _csv_parser(_r.result);
        _s = _d[0][0] + '\r\n';
        for (i = 1; i < _d.length; i++) {
            for (j = 0; j < _d[i].length; j++) {
                if (_d[i][j]) {
                    for (k = 0; k < j; k++) {
                        s = 0;
                        for (l = i; l < _d.length; l++)
                            s += !(!_d[l][k]);
                        if (!s)
                            _s += '  ';
                        else
                            _s += String.fromCharCode(9474);
                    }
                    b = String.fromCharCode(9492);
                    for (k = i + 1; k < _d.length; k++) {
                        if (_d[k][j - 1])
                            break;
                        else if (_d[k][j]) {
                            b = String.fromCharCode(9501);
                            break;
                        }
                    }
                    _s += b + _d[i][j] + '\r\n';
                }
            }
        }
        _ot.value = _s;
    }
};

function _csv_parser(d) {
    _a = [];
    _d = d.split('\r\n');
    _d.forEach(function(e) {
        _row = e.split(',');
        _a.push(_row);
    });
    return _a;
};