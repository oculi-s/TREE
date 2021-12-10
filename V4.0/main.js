window.$ = document.querySelector.bind(document);

var _cn = $('#_cn');
var _mu = $('#_mu');

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
const t = $('article tbody');
for (var r = 0; r < 20; r++) {
    var temp = `<tr>`;
    for (var c = 0; c<MAX_DEPTH; c++){
        temp += `<td contenteditable=true data-c=${c} data-r=${r} onkeyup=cmove></td>`
    }
    temp += `</tr>`;
    t.innerHTML += temp;
}

$('body').onresize = wresize;
function wresize(){
    if (/Android|iPhone|ipad|iPod/i.test(navigator.userAgent)) {
        $('article').classList.add('m-a');
    } else{
        $('article').classList.remove('m-a');
    }
}
wresize();

function cmove(){
    if(event.keyCode==38){
        alert(this.dataset.c);
        alert(this.dataset.r);
    }
}