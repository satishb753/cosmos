const fs = require("fs");
const util = require("util");


const authLog = (data) => {
  const logStdout = process.stdout;
  let path = __dirname + "\\auth.log";
  let errFilePath = __dirname + "\\err.log";
  data = util.format(data);
  try {
    if (!fs.existsSync(path)) {
      const logFile = fs.createWriteStream(path, { flags: "a" });
      logFile.write(data + "\n");
    } else {
      fs.appendFileSync(path, data + "\n");
      throw new Error("This will be logged to error file")
    }
  } catch (err) {
    console.log(err);
    console.log(err);
    // const formattedErr = util.format(err + '\n\n')
    const formattedErr = util.format(err + '\n\n')
    console.log("formatted Error: ",formattedErr);
    if(!fs.existsSync(errFilePath)){
      const errFile = fs.createWriteStream(errFilePath, {flags: "a"})
      errFile.write(formattedErr)
    } else {
      console.log("In the append error zone");
      fs.appendFileSync(errFilePath, err.toString(), {flags:'a'})
    }
    // console.log(err);
  }
  logStdout.write(data+' This is process.stdout\n')
};

module.exports = { authLog };
