var fs = require('fs');
var chars = ".*SE";

function createData(file) {
    var c, i, k, charMap = {},
        array = file.toString().split("\n"),
        data = [];
    for (c = 0; c < chars.length; c += 1) {
        charMap[chars[c]] = c;
    }

    for (i in array) {
        for (k in array[i]) {
            data.push(charMap[array[i][k]]);
        }
    }
    return {
        data: data,
        height: array.length,
        width: array[0].length
    };
}

fs.readFile('level-01.txt', function (err, file) {
    if (err) {
        throw err;
    }
    var data = createData(file),
        result = {};
    result.width = data.width;
    result.height = data.height;
    result.layers = [];
    result.layers.push(data);
    fs.writeFile("level-01.json", JSON.stringify(result));
});