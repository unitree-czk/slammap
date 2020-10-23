const fs = require('fs');
const yaml = require('js-yaml');
const data = fs.readFileSync(__dirname + '/' + 'location.yaml', 'utf8');

let i =0;

setInterval(() => {
    if (data) {
        console.log(data)
        i++;
    }

}, 100)


