const vscode = require('vscode')
const fs = require('fs'); // to read and write to files

const replaceCodeBlock = (jsonCode, origText) => {
    // read jsonCode and replace the code block
    var text = "nothing";
    // console.log("jsonCode: ", jsonCode);
    // read jsonCode as json object and extract the dictionary
    const cleanedContent = jsonCode.replace(/,\s*]/g, ']');
    const jsonObj = JSON.parse(cleanedContent);
    // Now I need to match Code from jsonObj with the code in the document
    const Refactorings = jsonObj["refactor"];
    // Refactorins is a list of dictionaries of the format {code, note, ref}
    // match each code with the code in the document and replace it with the ref
    for (var i = 0; i < Refactorings.length; i++) {
        const code = Refactorings[i]["code"];
        const ref = Refactorings[i]["ref"];
        const note = Refactorings[i]["note"];
        // replace code with ref
        origText = origText.replace(code,"replace"+ ref);
    }
    console.log("origText: ", origText);
    // Save origText into a file named change.scala
    // give relative path 
    fs.writeFile("E:/Semester 7/RnD/IDEtool_New/IDEtool/to-func-scala/change.scala", origText, (err) => {
        if (err) throw err;
        console.log('origText has been saved into file', origText.length);
    });


}




module.exports = replaceCodeBlock;
