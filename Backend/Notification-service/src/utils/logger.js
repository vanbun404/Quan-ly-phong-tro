const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

// Tạo thư mục logs nếu chưa có
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Định dạng thời gian
function getTimestamp() {
  return new Date().toISOString();
}

// Định dạng log message
function formatLog(level, message, meta = null) {
  const timestamp = getTimestamp();
  const logObject = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };
  return JSON.stringify(logObject);
}

// Ghi log vào file
function writeToFile(filename, message) {
  const filePath = path.join(logsDir, filename);
  const logMessage = message + "\n";

  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write log to file:", err);
    }
  });
}

class Logger {
  constructor(serviceName = "NOTIFICATION") {
    this.serviceName = serviceName;
  }

  info(message, meta) {
    const log = formatLog("INFO", message, meta);
    console.log(
      chalk.blue(`[${this.serviceName}]`),
      chalk.cyan("ℹ️"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    writeToFile("info.log", log);
    writeToFile("combined.log", log);
  }

  success(message, meta) {
    const log = formatLog("SUCCESS", message, meta);
    console.log(
      chalk.blue(`[${this.serviceName}]`),
      chalk.green("✅"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    writeToFile("info.log", log);
    writeToFile("combined.log", log);
  }

  warn(message, meta) {
    const log = formatLog("WARN", message, meta);
    console.warn(
      chalk.blue(`[${this.serviceName}]`),
      chalk.yellow("⚠️"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    writeToFile("warn.log", log);
    writeToFile("combined.log", log);
  }

  error(message, meta) {
    const log = formatLog("ERROR", message, meta);
    console.error(
      chalk.blue(`[${this.serviceName}]`),
      chalk.red("❌"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    writeToFile("error.log", log);
    writeToFile("combined.log", log);
  }
}

module.exports = new Logger();
