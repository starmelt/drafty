var fs = require('fs');
var chars = ".*SE"

function createData(file) {
    var charMap = {};
    for (var c=0; c<chars.length; c++) {
        charMap[chars[c]]=c;
    }
    var array = file.toString().split("\n");
    var data = [];
    for(var i in array) {
        for (var k in array[i]) {
            data.push(charMap[array[i][k]]);
        }
    }
    return {
        data: data,
        height: array.length,
        width: array[0].length
    };
}

fs.readFile('level-01.txt', function(err, file) {
    if(err) throw err;
    var data = createData(file);
    var result = {};
    result.width = data.width;
    result.height = data.height;
    result.layers = []
    result.layers.push(data);
    fs.writeFile("level-01.json", JSON.stringify(result));
});