window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

var MAX_DEPTH = 6;
var MAX_DATA = 20;
const ss = sessionStorage
const t = $('tbody');

for (var r = 0; r < MAX_DATA; r++) {
    var temp = `<tr>`;
    for (var c = 0; c < MAX_DEPTH; c++) {
        temp += `<td contenteditable=true data-c=${c} data-r=${r} onkeydown=cmove(this)></td>`
    }
    temp += `</tr>`;
    t.innerHTML += temp;
}
if ('tree_dict' in ss) {
    string = '';
    try {
        add_string(JSON.parse(ss.tree_dict), Array(MAX_DEPTH + 1).fill(String.fromCharCode(9474)), 0);
        $('textarea').value = string;
    } catch {
        ss.clear();
    }
}

$('body').onresize = wresize;

function wresize() {
    if (/Android|iPhone|ipad|iPod/i.test(navigator.userAgent || innerWidth < 400)) {
        $('article').classList.add('m-a');
        $('header').classList.add('m-h');
    } else {
        $('article').classList.remove('m-a');
        $('header').classList.remove('m-h');
    }
}
wresize();

var isend = 0;

function cmove(e) {
    if (event.keyCode > 36 && event.keyCode < 41) {
        var r = parseInt(e.dataset.r);
        var c = parseInt(e.dataset.c);
        var sel = getSelection();
        if (event.keyCode == 38 && r > 0) {
            t.children[r - 1].children[c].focus();
        } else if (event.keyCode == 40 && r < MAX_DATA - 1) {
            t.children[r + 1].children[c].focus();
        } else if (event.keyCode == 37 && c > 0) {
            if (!e.innerText) {
                t.children[r].children[c - 1].focus();
            } else if (!sel.anchorOffset) {
                if (!isend) {
                    isend = 1;
                } else {
                    t.children[r].children[c - 1].focus();
                    isend = 0;
                }
            }
        } else if (event.keyCode == 39 && c < MAX_DEPTH - 1) {
            if (!e.innerText) {
                t.children[r].children[c + 1].focus();
            } else if (sel.anchorOffset == e.innerText.length) {
                if (!isend) {
                    isend = 1;
                } else {
                    t.children[r].children[c + 1].focus();
                    isend = 0;
                }
            }
        }
    } else if (event.which == 13) {
        event.preventDefault();
        convert();
    }
}

var dict = {};
var arr = Array(MAX_DATA).fill('');
for (i = 0; i < MAX_DATA; i++) {
    arr[i] = Array(MAX_DEPTH).fill('')
}

function td(r, c) {
    return $$('tr')[r].children[c].innerText;
}

function el(r, c) {
    return arr[r][c];
}

function table_to_dict(func = td) {
    for (var i = 0; i < MAX_DATA; i++) {
        if (func(i, 0)) {
            var j = i + 1;
            while (!func(j, 0) && j++ < MAX_DATA - 1) {}
            add_data(dict, func(i, 0), i, j, 1, func);
        }
    }
}

function add_data(sub, c, s, e, DEPTH, func) {
    sub[c] = {};
    for (var i = s + 1; i < e; i++) {
        if (func(i, DEPTH) && DEPTH < MAX_DEPTH - 1) {
            var j = i + 1;
            while (!func(j, DEPTH) && j < MAX_DATA - 1) { j++; }
            if (func(i + 1, DEPTH + 1)) {
                add_data(sub[c], func(i, DEPTH), i, j, DEPTH + 1, func);
            } else {
                sub[c][func(i, DEPTH)] = {};
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

function convert(func) {
    string = '';
    table_to_dict(func);
    ss.tree_dict = JSON.stringify(dict);
    add_string(dict, Array(MAX_DEPTH + 1).fill(String.fromCharCode(9474)), 0);
    $('textarea').value = string;
}

function add_col() {
    MAX_DEPTH++;
    var tr = $$('tr');
    for (var r = 0; r < tr.length; r++) {
        tr[r].innerHTML += `<td contenteditable=true data-c=${c} data-r=${r} onkeydown=cmove(this)></td>`
    }
}

function rem_col() {
    if (MAX_DEPTH > 2) {
        MAX_DEPTH--;
        $$('td:last-child').forEach(e => {
            e.remove();
        })
    }
}

function add_row() {
    MAX_DATA++;
    var temp = `<tr>`;
    for (var c = 0; c < MAX_DEPTH; c++) {
        temp += `<td contenteditable=true data-c=${c} data-r=${MAX_DATA} onkeydown=cmove(this)></td>`
    }
    temp += `</tr>`;
    t.innerHTML += temp;
}

function rem_row() {
    if (MAX_DATA > 1) {
        MAX_DATA--;
        $('tr:last-child').remove();
    }
}

function upload() {
    var inp = $('input[type=file]');
    inp.click();
    inp.onchange = async() => {
        var csv = await inp.files[0].text();
        csv = csv.split('\r\n').slice(0, MAX_DATA);
        var i, j;
        for (i = 0; i < csv.length; i++) {
            var row = csv[i].split(',').slice(0, MAX_DEPTH);
            for (j = 0; j < row.length; j++) {
                t.children[i].children[j].innerText = row[j];
                arr[i][j] = row[j];
            }
        };
        convert(el);
    };
};

function remove() {
    if (confirm('clear All?')) {
        $$('td').forEach(e => { e.innerHTML = ''; });
    }
}

function download() {
    var csv = '';
    $$('tr').forEach(tr => {
        tr.childNodes.forEach(td => {
            csv += td.innerText + ','
        })
        csv += '\r\n';
    });
    file = new Blob([csv]), { type: 'text/csv' };
    saveAs(file, 'tree.csv');
}