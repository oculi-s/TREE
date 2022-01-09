window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

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

function index(a, b){
		var i;
    for (i=0; i<a.length; i++){
    		if (b==a[i])
        	return i;
    }
    return -1;
}

function cmove(e) {
    var k = event.keyCode;
    if (k > 36 && k < 41) {
        var sel = window.getSelection();
        var r = index(t.children, e.parentNode);
        var c = index(t.children[r].children, e);
        e.innerText = e.innerText.replace('\n','');
        if (k == 38 && r > 0) {
            t.children[r - 1].children[c].focus();
        } else if (k == 40) {
            if (r == MAX_DATA - 2) { add_row(); }
            t.children[r + 1].children[c].focus();
        } else if (k == 37 && c > 0) {
            if (!e.innerText) {
                e.previousSibling.focus();
            } else if (sel.anchorOffset == 1) {
                isend = 1;
            } else if (!sel.anchorOffset) {
                if (!isend) {
                    isend = 1;
                } else {
                    e.previousSibling.focus();
                    isend = 0;
                }
            }
        } else if (k == 39) {
            if (!e.innerText) {
                if (c == MAX_DEPTH - 2) { add_col();}
                t.children[r].children[c+1].focus();                
            } else if (sel.anchorOffset == e.innerText.length - 1) {
                isend = 1;
            } else if (sel.anchorOffset == e.innerText.length) {
                if (!isend) {
                    isend = 1;
                } else {
                    if (c == MAX_DEPTH - 2) { add_col();}
		                t.children[r].children[c+1].focus();   
                    isend = 0;
                }
            }
        }
    } else if (k == 13) {
        event.preventDefault();
        convert();
    }
}

function td(r, c) {
    return $$('tr')[r].children[c].innerText.replace('\n','');
}

function table_to_dict() {
    for (var i = 0; i < MAX_DATA; i++) {
        if (td(i, 0)) {
            var j = i + 1;
            while (!td(j, 0) && j++ < MAX_DATA - 1) {}
            add_data(dict, td(i, 0), i, j, 1);
        }
    }
}

function add_data(sub, c, s, e, DEPTH) {
    sub[c] = {};
    for (var i = s + 1; i < e; i++) {
        if (td(i, DEPTH) && DEPTH < MAX_DEPTH - 1) {
            var j = i + 1;
            while (!td(j, DEPTH) && j++ < MAX_DATA - 1) {}
            if (td(i + 1, DEPTH + 1)) {
                add_data(sub[c], td(i, DEPTH), i, j, DEPTH + 1);
            } else {
                sub[c][td(i, DEPTH)] = {};
            }
        }
    }
}

function add_string(sub, b, DEPTH) {
    for (var i in sub) {
				var c = Array.from(b);
        if (DEPTH) {
            string += b.slice(0, DEPTH - 1).join('');
            if (Object.keys(sub).length == 1) {
								c[DEPTH - 1] = '  ';
                string += String.fromCharCode(9492);
            } else {
                string += String.fromCharCode(9501);
            }
        }
        string += `${i}\r\n`;
        if (Object.keys(sub[i])) {
            add_string(sub[i], c, DEPTH + 1);
        }
        delete sub[i]
    }
}

function convert() {
    string = '';
    dict = {};
    table_to_dict();
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
		    $$('td').forEach(e => { e.innerHTML = ''; });
        var csv = await inp.files[0].text();
        csv = csv.replaceAll('\n','').split('\r');
        csv.pop();
        while (csv.length > MAX_DATA - 1) { add_row(); }
        while (csv[0].split(',').length > MAX_DEPTH - 1) { add_col(); }
        var i, j;
        for (i = 0; i < csv.length; i++) {
            var row = csv[i].split(',');
            for (j = 0; j < row.length; j++) {
                t.children[i].children[j].innerText = row[j].replace(/\n|\r*/g, "");
                t.children[i].children[j].innerText.replace('\n','');
            }
        }
				while (!t.children[MAX_DATA - 2].innerText){rem_row();}
				while (!Array.from($$('td:nth-last-child(2)')).map(e=>e.innerText).join('')){rem_col();}
        convert();
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