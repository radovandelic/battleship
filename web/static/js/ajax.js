function writeData(column, id, value) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);//
            dbwrite = this.responseText;
        }
    };
    xmlhttp.open("GET", "write/?column=" + column + "&id=" + id + "&value=" + value, true);
    xmlhttp.send();
}

function readData(id, who, todo) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));

            if (who === 'opponent') {
                opponent = JSON.parse(this.responseText);
            } else {
                player = JSON.parse(this.responseText);
            }
        }
    };
    xmlhttp.open("GET", "read/?id=" + id, true);
    xmlhttp.send();

}

function resetData() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);//
            dbwrite = this.responseText;
        }
    };
    xmlhttp.open("GET", "reset");
    xmlhttp.send();
    return;
}
