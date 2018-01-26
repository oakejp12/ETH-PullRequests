var fs = require('fs');

var contents = fs.readFileSync('../../../build/contracts/Congress.json');

var jsonContents = JSON.parse(contents);

console.log(jsonContents);

