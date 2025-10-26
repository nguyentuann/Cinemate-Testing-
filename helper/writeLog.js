import fs from "fs";
import { logFile } from "../constant/path_file.js";

function writeLog(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + "\n", "utf-8");
}

export { writeLog };