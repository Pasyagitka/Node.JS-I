function loadJSONXML() {
    loadJSON();
    loadXML();
};

function loadJSON(){
    let result = document.getElementById('json');
    fetch('http://localhost:5000/application/json.json')
        .then(response => response.json())
        .then(response => { result.innerText = JSON.stringify(response); });
}

function loadXML() {
    let result = document.getElementById('xml');
    fetch('http://localhost:5000/application/xml.xml')
        .then(response => response.text())
        .then(response => { result.innerText = response;});
}