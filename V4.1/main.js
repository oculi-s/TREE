window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

NodeList.prototype.indexOf = Array.prototype.indexOf;

var MAX_DEPTH = 6;
var MAX_DATA = 11;
const ss = sessionStorage;
const t = $('tbody');
const ntd = `<td contenteditable=true onkeydown=cmove(this)></td>`;
var dict = {};
var arr = [];
var string = '';

t.innerHTML += `<tr>${ntd.repeat(MAX_DEPTH)}</tr>`.repeat(MAX_DATA);
$('body').onresize = wresize;

function wresize() {
    if (/Android|iPhone|ipad|iPod/i.test(navigator.userAgent) || innerWidth < 400) {
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
    var k = event.keyCode;
    if (k > 36 && k < 41) {
        var r = $$('tr').indexOf(e.parentNode);
        var c = $$('tr')[r].childNodes.indexOf(e);
        var sel = getSelection();
        if (k == 38 && r > 0) {
            t.children[r - 1].children[c].focus();
        } else if (k == 40) {
            if (r == MAX_DATA - 2) { add_row(); }
            t.children[r + 1].children[c].focus();
        } else if (k == 37 && c > 0) {
            if (!e.innerHTML) {
                t.children[r].children[c - 1].focus();
            } else if (sel.anchorOffset == 1) {
                isend = 1;
            } else if (!sel.anchorOffset) {
                if (!isend) {
                    isend = 1;
                } else {
                    t.children[r].children[c - 1].focus();
                    isend = 0;
                }
            }
        } else if (k == 39) {
            if (!e.innerHTML) {
                if (c == MAX_DEPTH - 2) { add_col(); }
                t.children[r].children[c + 1].focus();
            } else if (sel.anchorOffset == e.innerHTML.length - 1) {
                isend = 1;
            } else if (sel.anchorOffset == e.innerHTML.length) {
                if (!isend) {
                    isend = 1;
                } else {
                    if (c == MAX_DEPTH - 2) { add_col(); }
                    t.children[r].children[c + 1].focus();
                    isend = 0;
                }
            }
        }
    } else if (k == 13) {
        event.preventDefault();
        convert();
    }
}

function init_arr() {
    arr = Array(MAX_DATA).fill('');
    for (i = 0; i < MAX_DATA; i++) {
        arr[i] = Array(MAX_DEPTH).fill('')
    }
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
            while (!func(j, DEPTH) && j++ < MAX_DATA - 1) {}
            if (func(i + 1, DEPTH + 1)) {
                add_data(sub[c], func(i, DEPTH), i, j, DEPTH + 1, func);
            } else {
                sub[c][func(i, DEPTH)] = {};
            }
        }
    }
}


function add_string(sub, b, DEPTH) {
    for (var i in sub) {
        if (DEPTH) {
            string += b.slice(0, DEPTH - 1).join('');
            if (Object.keys(sub).length == 1) {
                b[DEPTH - 1] = '  ';
                string += String.fromCharCode(9492);
            } else {
                string += String.fromCharCode(9501);
            }
        }
        string += `${i}\r\n`;
        if (Object.keys(sub[i])) {
            add_string(sub[i], b, DEPTH + 1);
        }
        delete sub[i]
    }
}

function convert(func) {
    string = '';
    dict = {};
    init_arr();

    table_to_dict(func);
    add_string(dict, Array(MAX_DEPTH).fill(String.fromCharCode(9474)), 0);
    $('textarea').value = string;
}

function add_col() {
    $$('tr').forEach(e => { e.innerHTML += ntd; });
    MAX_DEPTH++;
}

function rem_col() {
    if (MAX_DEPTH > 2) {
        $$('td:last-child').forEach(e => { e.remove(); });
        MAX_DEPTH--;
    }
}

function add_row() {
    t.innerHTML += `<tr>${ntd.repeat(MAX_DEPTH)}</tr>`;
    MAX_DATA++;
}

function rem_row() {
    if (MAX_DATA > 1) {
        $('tr:last-child').remove();
        MAX_DATA--;
    }
}

function upload() {
    var inp = $('input[type=file]');
    inp.click();
    inp.onchange = async() => {
        var csv = await inp.files[0].text();
        csv = csv.split('\r\n');
        csv.pop();
        while (csv.length > MAX_DATA - 1) { add_row(); }
        while (csv[0].split(',').length > MAX_DEPTH - 1) { add_col(); }
        var i, j;
        for (i = 0; i < csv.length; i++) {
            var row = csv[i].split(',');
            for (j = 0; j < row.length; j++) {
                t.children[i].children[j].innerText = row[j].replace(/\n|\r*/g, "");
                arr[i][j] = row[j].replace(/\n|\r*/g, "");
            }
        }
        convert(el);
    }
}

function clear_all() {
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
    file = new Blob([csv]), { type: 'text/csv' }
    saveAs(file, 'tree.csv');
}