/*
 * 
 */

var fs      = require("fs");
var uglify  = require("uglify-js");

desc("This is the default task.");
task("default", [], function() {
    //console.log("Hello, world!");
    
    var out = fs.createWriteStream("script.js");
    var target = [
        "../js/param.js",
        "../js/main.js",
        "../js/titlescene.js",
        "../js/mainscene.js",
        "../js/endscene.js",
        "../js/pausescene.js",
    ];
    var fileContents = [];
    
    for (var i=0,len=target.length; i<len; ++i) {
        var file = fs.readFileSync(target[i]);
        fileContents.push( file.toString() );
    }
    
    var codeText = fileContents.join("\n\n");
    var ast = uglify.parser.parse(codeText);
    ast = uglify.uglify.ast_mangle(ast);
    ast = uglify.uglify.ast_squeeze(ast);
    var finalCode = uglify.uglify.gen_code(ast);
    
    out.write(finalCode);
});
