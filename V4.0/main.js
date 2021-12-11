window.$ = document.querySelector.bind(document);

const MAX_DEPTH = 5;
const MAX_DATA = 20;
const t = $('article tbody');

for (var r = 0; r < MAX_DATA; r++) {
    var temp = `<tr>`;
    for (var c = 0; c < MAX_DEPTH; c++) {
        temp += `<td><input type=text data-c=${c} data-r=${r} onkeyup=cmove(this)></input></td>`
    }
    temp += `</tr>`;
    t.innerHTML += temp;
}

$('body').onresize = wresize;

function wresize() {
    if (/Android|iPhone|ipad|iPod/i.test(navigator.userAgent)) {
        $('article').classList.add('m-a');
    } else {
        $('article').classList.remove('m-a');
    }
}
wresize();

var isend = 0;

function cmove(e) {
    if (event.keyCode > 36 && event.keyCode < 41) {
        var r = parseInt(e.dataset.r);
        var c = parseInt(e.dataset.c);
        if (event.keyCode == 38 && r > 0) {
            t.children[r - 1].children[c].firstChild.focus();
        } else if (event.keyCode == 40 && r < MAX_DATA - 1) {
            t.children[r + 1].children[c].firstChild.focus();
        } else if (event.keyCode == 37 && c > 0) {
            if (!e.value) {
                t.children[r].children[c - 1].firstChild.focus();
            } else if (!e.selectionStart) {
                if (!isend) {
                    isend = 1;
                } else {
                    t.children[r].children[c - 1].firstChild.focus();
                    isend = 0;
                }
            }
        } else if (event.keyCode == 39 && c < MAX_DEPTH - 1) {
            if (!e.value) {
                t.children[r].children[c + 1].firstChild.focus();
            } else if (e.selectionEnd == e.value.length) {
                if (!isend) {
                    isend = 1;
                } else {
                    t.children[r].children[c + 1].firstChild.focus();
                    isend = 0;
                }
            }
        }
    } else if (event.keyCode == 13) {
        convert();
    }
}

var dict = {};

function td(r, c) {
    return t.children[r].children[c].firstChild.value;
}

function table_to_dict() {
    for (var i = 0; i < MAX_DATA; i++) {
        if (td(i, 0)) {
            add_data(dict, td(i, 0), i, 1);
        }
    }
}

function add_data(sub, c, j, DEPTH) {
    sub[c] = {};
    for (var i = j + 1; i < MAX_DATA - 1; i++) {
        if (td(i, DEPTH)) {
            if (DEPTH < MAX_DEPTH - 1) {
                if (td(i + 1, DEPTH + 1)) {
                    add_data(sub[c], td(i, DEPTH), i, DEPTH + 1);
                } else {
                    sub[c][td(i, DEPTH)] = {};
                }
            }
        }
    }
}

var string;
var start = Array(MAX_DEPTH + 1).fill(String.fromCharCode(9474));

function add_string(sub, DEPTH) {
    for (var i in sub) {
        var o = Object.keys(sub);
        b = '';
        if (DEPTH) {
            b = start.slice(1, DEPTH).join('');
            if (o.length == 1) {
                b += String.fromCharCode(9492);
                start[DEPTH] = '  ';
            } else {
                b += String.fromCharCode(9501);
            }
        }
        string += `${b}${i}\r\n`;
        if (Object.keys(sub[i]).length) {
            add_string(sub[i], DEPTH + 1);
        }
        delete sub[i]
    }
}

function convert() {
    string = '';
    table_to_dict();
    console.log(dict);
    add_string(dict, 0);
    $('textarea').value = string;
}