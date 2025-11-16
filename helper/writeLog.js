import fs from "fs";

function writeLog(logFile, msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + "\n", "utf-8");
}

export { writeLog };