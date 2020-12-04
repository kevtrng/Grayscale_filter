/***
    Name: Keven Truong
    Student no: A01248981   

    Damn shoutout to those goats that i sacrifced
    Coding at 4am is fun but also not fun LOL

 ****/





const http = require("http"),
formidable = require("formidable")
fs = require("fs"),
path = require("path"),
IOhandler = require("./IOhandler");

http.createServer(function (req, res) {
const form = formidable({keepExtensions: true, uploadDir: path.join(__dirname, "uploads")});

//upload whoot
if(req.url == "/upload" && req.method.toLowerCase()==="post"){
    res.writeHead(200, { 'content-type': 'text/html' });
    form.parse(req, (err, fields, files) => {
        if(err){res.end(err)}
        let photoPath = files.fileUpload.path;
        IOhandler.grayScale(photoPath, path.join("grayscaled", "image_greyscaled.png"))
            .then(() => {
                res.end(`
                    uploaded! <br>
                    <a href = "/">Go back</a><br>
                `)
            })
            .catch(() => res.end("hmmm something went wrong ."))
    })
    return;
}
// home home home home //
let filePath = "." + req.url;
if (filePath == "./") {
    filePath = "./index.html";
}
fs.readFile(filePath, (error, content) => {
    if (error) {
        res.writeHead(500);
        res.end("There's an error: " + error.code + " ..\n");
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(content, "utf-8");
        IOhandler.readDir("uploads").then(imgs => {
            if(imgs.length != 0){
                res.end(`
                    <img src="uploads/${imgs[0]}" />
                    <img src="${path.join("grayscaled", "image_greyscaled.png")}" />
                `)
            }
        })
        .catch(() => res.end())
    }
});
}).listen(9000);
console.log("Server running at http://127.0.0.1:9000/");