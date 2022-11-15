const fs = require("fs");
const util = require("util");


const authLog = (data) => {
  const logStdout = process.stdout;
  let path = __dirname + "\\auth.log";
  let errFilePath = __dirname + "\\err.log";
  data = util.format(data);
  try {
    if (!fs.existsSync(path)) {
      const logFile = fs.createWriteStream(path, { flags: "w" });
      logFile.write(data + "\n");
    } else {
      fs.appendFileSync(path, data + "\n");
      throw new Error("This will be logged to error on " + new Date(Date.now()).toUTCString())
    }
  } catch (err) {
    if(!fs.existsSync(errFilePath)){
      const errFile = fs.createWriteStream(errFilePath, {flags: "w"})
      errFile.write(util.format(err) + '\n\n')
    } else {
      fs.appendFileSync(errFilePath, util.format(err)+'\n\n')
    }
  }
  logStdout.write(util.format(data)+' This is process.stdout\n')
};

module.exports = { authLog };
