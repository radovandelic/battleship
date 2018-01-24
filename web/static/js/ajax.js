const getAll = (callback) => {
    fetch("https://battleshipsjs.herokuapp.com/getall/", { method: 'GET' })
        .then(res => res.json())
        .then(res => callback(res))
        .catch(err => console.log(err));
}

/*function writeData(column, id, value) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dbwrite = this.responseText;
        }
    };
    xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/write/?column=" + column + "&id=" + id + "&value=" + value, true);
    xmlhttp.send();
}*/

const writeData = (object) => {
    var options = {
        method: 'POST',
        body: JSON.stringify(object)
    }
    fetch(`https://battleshipsjs.herokuapp.com/write/?id=${object.id}`, options)
        .then(res => res.text())
        .then(res => {
            console.log(res);
        });

}

function readData(object, todo) {
    fetch("https://battleshipsjs.herokuapp.com/read/?id=" + object.id, { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            object = res;
            if (todo) todo(res);
        })
        .catch(err => console.log(err));

    /*var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            if (who === 'start') {
                var object = JSON.parse(this.responseText);
                dbactive = object.active == 0 ? 0 : dbactive;
            } else if (who === 'opponent') {
                console.log(this.responseText);
                opponent = JSON.parse(this.responseText);
            } else {

                player = JSON.parse(this.responseText);
            }
            if (todo) todo();
        }
    };
    xmlhttp.open("GET", "https://battleshipsjs.herokuapp.com/read/?id=" + id, true);
    xmlhttp.send();*/

}

function resetData(id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);//
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
