// const vscode = require('vscode')
const fs = require('fs'); // to read and write to files
const readline = require('readline');
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

const replaceCodeBlock = () => {
    const filePath = 'test.json'; // Replace with the path to your file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    // replace linebreaks within "code" with "\\n
    // console.log(fileContent);
    const cleanedContent = fileContent.replace(/,\s*]/g, ']')
    // Remove line breaks within the values
    // const cleanedContent = fileContent;
    // console.log(cleanedContent)
    try {
        var jsonObject = JSON.parse(cleanedContent);
        // console.log(jsonObject, "jsonObject");
        // Parse the cleaned content as a JSON object
    } catch (error) {
    console.error('Error parsing JSON:', error);
    }
    const Refactorings = jsonObject["refactor"];
    const filePath2 = 'MyTest.scala'; // Replace with the path to your file
    var origText = JSON.stringify(fs.readFileSync(filePath2, 'utf8'));
    // remove /r 
    origText = origText.replace(/\\r/g, '');
    
    // origText= JSON.stringify(origText);
    var code = Refactorings[2]["code"];
    code = JSON.stringify(code);
    // code = code.replace(/\\/g, '\\\\');
    // take the substring from 1 to length-1
    code = code.substring(1, code.length-1);
    console.log(origText.includes(code), "code prev", code);


    console.log(code, "code now", `for (x <- xs) {\\n        if(h(x))\\n            println(x)\\n   }`);
    console.log("lengths, ", code.length, "for (x <- xs) {\\n        if(h(x))\\n            println(x)\\n   }".length);
    

    fs.writeFileSync("temp.scala", code);
    // , (err) => {
    //     if (err) throw err;
    //     console.log('origText has been saved into file', origText.length);
    // });
    code = "for (x <- xs) {\\n        if(h(x))\\n            println(x)\\n   }";
    var newCode = fs.readFileSync("temp.scala", 'utf8');
    console.log('new code from temp.scala', newCode);
    // code = code.replace(/\\/g, '\\\\');
    // fs.writeFile("temp.scala", JSON.stringify(newCode), (err) => {
    //     if (err) throw err;
    //     console.log('origText has been saved into file', origText.length);
    // });

    // var newCode2 = fs.readFileSync("temp.scala", 'utf8');
    // if(newCode == newCode2){
    //     console.log("Code matchs again, ", newCode, newCode2)
    // }

    code = "for (x <- xs) {\\n        if(h(x))\\n            println(x)\\n   }";

    if(code == newCode){
        console.log("Code matchs, ", code, newCode)
    }

    origText.includes(code);
    // console.log(origText);

    console.log(origText.includes(code), "code 1", newCode, code);
    code = Refactorings[2]["code"];
    code = JSON.stringify(code);
    code = code.replace(/\\/g, '\\\\');
    console.log(code, "code 2");
    // console.log(newCode2, "newCode 2");
    fs.writeFile("temp.scala", code, (err) => {
        if (err) throw err;
        console.log('origText has been saved into file', origText.length);
    });
    
    const modifText = origText;

console.log('-----------------------------');    
    for (var i = 0; i <Refactorings.length; i++) {
        var code = Refactorings[i]["code"];
        const ref = Refactorings[i]["ref"];
        const note = Refactorings[i]["note"];
        const lineNo = parseInt(Refactorings[i]["lineNo"]);
        // convert lineNo to integer 
        // remove spaces and \n from code
        // code = code.replace(/ /g,'');
        // code = code.replace(/\n/g, '');
        code = JSON.stringify(code);

        // const checkcode = code.replace(/\\/g, '\\\\');
        // const checkcode = code
        code = code.substring(1, code.length-1);
        // console.log(code)
    const pattern = new RegExp(code, 'g');
        
            console.log(origText.includes(code), "There is a match here, ", code, origText.indexOf(code), origText.length, origText.substring(origText.indexOf(code), origText.indexOf(code)+code.length), lineNo);
            // continue;

        // Check for the pattern in origText 
        // const isPatternPresent = pattern.test(origText);
        // origText.replace(pattern, ref);

        // console.log("Pattern is present:", isPatternPresent);
        // if (origText.includes(pattern)){
        //     console.log("There is a match here, ", code, ref)
        //     continue;
        // }
        // origText = modifText.replace(code,"replace"+ ref);

    }
    // const pattern = new RegExp(escapeRegExp(codeToMatch), 'g');
    // const result = inputString.replace(pattern, refValue);

    // write the origText into a file
    var code = Refactorings[2]["code"];
    const pattern = new RegExp(code, 'g');
    // get the pattern as string 
    // console log the pattern 
    console.log(pattern);


    // fs.writeFile("temp.scala", origText, (err) => {
    //     if (err) throw err;
    //     console.log('origText has been saved into file', origText.length);
    // });

    /*
    fs.readFile(filePath2, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
      
        // Convert the file content to a format that displays escape sequences
        // var outputString = JSON.stringify(data);
        var outputString = data;
        // remove \r from outputString 
        outputString = outputString.replace(/\\r/g, '');
        // replace all \ by \\ 
        // outputString = outputString.replace(/\\/g, '\\\\');
        console.log(outputString);  
        const check = JSON.stringify(Refactorings[1]["code"]);
        if(outputString.includes(check)){
            console.log("There is a match above")
        }
        // How to check if a=500 is present in the file

        for (var i = 0; i <3; i++) {
            var code = Refactorings[i]["code"];
            const ref = Refactorings[i]["ref"];
            const note = Refactorings[i]["note"];
            // remove spaces and \n from code
            // code = code.replace(/ /g,'');
            // code = code.replace(/\n/g, '');
            // code = JSON.stringify(code);
            const checkcode = code.replace(/\\/g, '\\\\');
            // const checkcode = code
            console.log(checkcode)
            
            // replace code with ref
            // check if there is a replace with ref 
            if (outputString.includes(checkcode)){
                console.log("There is a match here, ", code, ref)
                continue;
            }
            // origText = modifText.replace(code,"replace"+ ref);
    
        }
      
        
      });
      
*/
      /*
{ "code" : "if(a>c)\n 0\nelse if(a<c && a>d)\n 1\nelse if(a==d)\n 2\nelse if(a<d)\n 3\nelse if(a==500)\n 4\nelse\n 5\n" , 
    "note" : "pattern" , "ref" : "a match {\ncase _ if(a>c) => 0\ncase _ if(a<c && a>d) => 1\ncase `d` => 2\ncase _ if(a<d) => 3\ncase 500 => 4\ncase _ => 5\n}\n"}
      */

    




    


    // console.log(JSON.stringify(modifText));

    // for (var i = 8; i <Refactorings.length; i++) {
    //     var code = Refactorings[i]["code"];
    //     const ref = Refactorings[i]["ref"];
    //     const note = Refactorings[i]["note"];
    //     // remove spaces and \n from code
    //     // code = code.replace(/ /g,'');
    //     // code = code.replace(/\n/g, '');
    //     console.log(code)
    //     // replace code with ref
    //     // check if there is a replace with ref 
    //     if (modifText.includes(code)){
    //         console.log("There is a match, ", code, ref)
    //         continue;
    //     }
    //     origText = modifText.replace(code,"replace"+ ref);

    // }
    // origText = modifText.replace(/\\n/g, '\n');
    // origText = modifText
    // console.log(origText);
    fs.writeFile("change.scala", origText, (err) => {
        if (err) throw err;
        console.log('origText has been saved into file', origText.length);
    });

}

replaceCodeBlock();


module.exports = replaceCodeBlock;
