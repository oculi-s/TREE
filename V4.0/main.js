window.$ = document.querySelector.bind(document);
alert(window.$);

var _fi = $('#_fi');
var _cn = $('#_cn');
var _mu = $('#_mu');
alert(_fi);

function _file_check() {
    if (_fi.files.length == 0) {
        alert('No file uploaded')
    }
    else {
        _file = _fi.files[0];
        _csv_to_table(_file);
    }
}

const MAX_DEPTH = 5;
const t = $('article table');
for (var r = 0; r < 20; r++) {
    var temp = `<tr>`;
    for (var c = 0; c<MAX_DEPTH; c++){
        temp += `<td data-c=${c} data-r=${r}><input type=text></input></td>`
    }
    temp += `</tr>`;
    t.innerHTML += temp;
}

alert($('article table').innerHTML);