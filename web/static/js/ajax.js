const getAll = (callback) => {
    fetch("https://battleshipsjs.herokuapp.com/getall/", { method: 'GET' })
        .then(res => res.json())
        .then(res => callback(res))
        .catch(err => console.log(err));
}

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

function readData(who, todo) {
    fetch("https://battleshipsjs.herokuapp.com/read/?id=" + [who].id, { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            if (who === 'opponent') {
                opponent = res;
            } else {
                player = res;
            }

            if (todo) todo(res);
        })
        .catch(err => console.log(err));
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
