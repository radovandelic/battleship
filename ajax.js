function writeData(str) {
    if (str == "") {
        document.getElementById("startButton").innerHTML = "";
        return;
    } else {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("startButton").innerHTML = this.responseText;
                console.log(this.responseText);
            }
        };
        xmlhttp.open("GET","write.php?q="+str,true);
        xmlhttp.send();
    }
}
