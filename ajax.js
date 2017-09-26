function writeData(column, id, value) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);//
            dbwrite = this.responseText;
        }
    };
    xmlhttp.open("GET", "write.php?column=" + column + "&id=" + id + "&value=" + value, true);
    xmlhttp.send();
}

function readData(column, id, todo, object) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);//
            if (object == undefined) {
                dbactive = this.responseText;
                todo();
            } else {
                object[column] = isNaN(this.responseText.trim()) ?
                    JSON.parse(this.responseText) : this.responseText;
                todo();
            }
        }
    };
    xmlhttp.open("GET", "read.php?column=" + column + "&id=" + id, true);
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
    xmlhttp.open("GET", "reset.php");
    xmlhttp.send();
    return;
}
