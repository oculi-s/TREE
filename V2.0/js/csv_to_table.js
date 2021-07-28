_ot = document.getElementById('_ot')
_a = [];

function _csv_to_table(_file) {
    _r = new FileReader();
    _r.readAsText(_file, 'UTF-8');
    _r.onload = function (e) {
        _d = _csv_parser(_r.result);
        _s = _d[0][0] + '\r\n';
        for (i = 1; i < _d.length; i++) {
            for (j = 0; j < _d[i].length; j++) {
                if (_d[i][j]) {
                    a = '│', b = '└';
                    for (k = i + 1; k < _d.length; k++) {
                        if (_d[k][j-1])
                            break;
                        else if (_d[k][j]) {
                            b = '├';
                            break;
                        }
                    }
                    s = 0;
                    for (k = 0; k < j; k++)
                        for (l = i; l < _d.length; l++)
                            s += !(!_d[l][k]);
                    if (!s)
                        a = '  ';
                    _s += a.repeat(j - 1) + b + _d[i][j] + '\r\n';
                }
            }
        }
        _ot.innerHTML = _s;
    }
};

function _csv_parser(d) {
    _d = d.split('\r\n');
    _d.forEach(function (e) {
        _row = e.split(',');
        _a.push(_row);
    });
    return _a;
};