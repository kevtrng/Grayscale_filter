const unzipper = require('unzipper'),
  fs = require("fs"),
  PNG = require('pngjs').PNG,
  path = require('path');


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise ((resolve, reject) => {
    const str = fs.createReadStream("myfile.zip").pipe(unzipper.Extract({path: pathOut}));
      str.on("close", () => resolve(console.log("Extraction operation complete")));
      str.on("error", err => reject(err));
  })
};




/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 */
const readDir = dir => {
    return new Promise((resolve, reject) => {
        let images = [];
        fs.readdir(dir, {encoding: "utf-8"}, (err, files) =>{
            if (err) reject(err);
            files.forEach((file) => {
                if(path.extname(file) == ".png"){
                    images.push(file);
                }
            });
            resolve(images);
        })
    })

};



/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(pathIn).pipe(new PNG ())
        .on("error", (err) => reject(err))
        // for some reason, replacing the function declaration
        // with a lambda function makes this thing crash
        // so this shall stay as it is:
        .on("parsed", function() {
            for(let pixel = 0; pixel < this.data.length; pixel += 3) {
                // set the rgb values to the average:
                this.data[pixel] =
                this.data[pixel+1] =
                this.data[pixel+2] =
                    (this.data[pixel] + this.data[pixel+1] + this.data[pixel+2]) /3
            }
            this.pack().pipe(fs.createWriteStream(pathOut)).on("close", ()=>resolve(pathIn));
        });
    })
};


module.exports = {
  unzip,
  readDir,
  grayScale
};
