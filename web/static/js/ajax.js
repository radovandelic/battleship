function writeData(column, id, value) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dbwrite = this.responseText;
        }
    };
    xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/write/?column=" + column + "&id=" + id + "&value=" + value, true);
    xmlhttp.send();
}

function readData(id, who, todo) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            if (who === 'start') {
                var object = JSON.parse(this.responseText);
                dbactive = object.active == 0 ? 0 : dbactive;
            } else if (who === 'opponent') {
                opponent = JSON.parse(this.responseText);
            } else {

                player = JSON.parse(this.responseText);
            }
            if (todo) todo();
        }
    };
    xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/read/?id=" + id, true);
    xmlhttp.send();

}

function resetData(id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);//
            dbwrite = this.responseText;
        }
    };
    if (id) {
        xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/reset?id=" + id);
    } else {
        xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/reset");
    }
    xmlhttp.send();
    return;
}
