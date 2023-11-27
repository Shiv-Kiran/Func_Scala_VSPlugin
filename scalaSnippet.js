const vscode = require('vscode')
const fs = require('fs'); // to read and write to files
const replaceCodeBlock = require('./replaceText');
const { getRefactorings } = require('./createFeature');
const {decorateLines} = require('./lineDecor');


async function callScalaSnippet  (input) {
    var output = "nothing";

  fs.writeFile("E:/Semester 7/RnD/IDEtool/namrata/src/main/scala/temp_snippet.txt", input, (err) => {
    if (err) throw err;
    console.log('snippet has been saved into file', input.length);
  });

  // Call Scala program, give documentText as input, throw the output into a file for now
  function goToScala() {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {

      exec(`cd /d "E:/Semester 7/RnD/IDEtool/namrata" && sbt --error "run  src/main/scala/temp_snippet.txt"`,
        (err, stdout, stderr) => {
            output = stdout;
            resolve(stdout);
            console.log("Successfuly Output");
           
            if (err) {
                console.log('error: ' + err);
                reject();
            }
        });
    });
    
  }
  const ans = goToScala();
  await ans; 
  ans.then( async () => {
    console.log("output: ", output);
  }).catch((err) => {
    console.log("error: ", err);
    });
    const cleanedContent = output.replace(/,\s*]/g, ']')
    var jsonObject = JSON.parse(cleanedContent);
    
    // parse through refactor and get "code" object and "ref" object
    output = "";
    jsonObject = jsonObject["refactor"];
    for(var i = 0; i < jsonObject.length; i++){
        const code = jsonObject[i]["code"];
        const ref = jsonObject[i]["ref"];
        output += "/*" + code + "\n*/" + "\n" + ref + "\n";
    }



        return output;
};

module.exports = { callScalaSnippet};