let fs = require('fs');
fs.readFile(__dirname + '/config.json', function (err, contents) {
    if (err) {
        throw err;
    }
    doSomething(contents);
})

function doSomething(contents) {
    console.log(contents);
}