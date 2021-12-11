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
        $('header a').classList.add('m-t');
    } else {
        $('article').classList.remove('m-a');
        $('header a').classList.remove('m-t');
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
            var j = i + 1;
            while (!td(j, 0) && j < MAX_DATA - 1) {
                j++;
            }
            add_data(dict, td(i, 0), i, j, 1);
        }
    }
}

function add_data(sub, c, s, e, DEPTH) {
    sub[c] = {};
    for (var i = s + 1; i < e; i++) {
        if (td(i, DEPTH) && DEPTH < MAX_DEPTH - 1) {
            var j = i + 1;
            while (!td(j, DEPTH) && j < MAX_DATA - 1) { j++; }
            if (td(i + 1, DEPTH + 1)) {
                add_data(sub[c], td(i, DEPTH), i, j, DEPTH + 1);
            } else {
                sub[c][td(i, DEPTH)] = {};
            }
        }
    }
}

var string;

function add_string(sub, b, DEPTH) {
    for (var i in sub) {
        var o = Object.keys(sub);
        var c = b.slice();
        if (DEPTH) {
            string += b.slice(0, DEPTH - 1).join('');
            if (o.length == 1) {
                c[DEPTH - 1] = '  ';
                string += String.fromCharCode(9492);
            } else {
                string += String.fromCharCode(9501);
            }
        }
        string += `${i}\r\n`;
        if (Object.keys(sub[i]).length) {
            add_string(sub[i], c, DEPTH + 1);
        }
        delete sub[i]
    }
}

function convert() {
    string = '';
    table_to_dict();
    add_string(dict, Array(MAX_DEPTH + 1).fill(String.fromCharCode(9474)), 0);
    $('textarea').value = string;
}

function del() {
    if (confirm('delete?')) {
        var inp = document.querySelectorAll('input');
        for (var i = 0; i < inp.length; i++) {
            inp[i].value = '';
        }
    }
}