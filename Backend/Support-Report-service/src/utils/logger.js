const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const logsDir = path.join(__dirname, "../../logs");

// Tạo folder logs nếu chưa có
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  constructor(serviceName = "SUPPORT-REPORT") {
    this.serviceName = serviceName;
  }

  // Info log
  info(message, meta) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.log(
      chalk.blue(`[${this.serviceName}]`),
      chalk.cyan("ℹ️"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    fs.appendFileSync(path.join(logsDir, "app.log"), logMessage);
  }

  // Success log
  success(message, meta) {
    console.log(
      chalk.blue(`[${this.serviceName}]`),
      chalk.green("✅"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
  }

  // Warning log
  warn(message, meta) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    console.warn(
      chalk.blue(`[${this.serviceName}]`),
      chalk.yellow("⚠️"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    fs.appendFileSync(path.join(logsDir, "app.log"), logMessage);
  }

  // Error log
  error(message, meta) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n${
      meta && meta.stack ? meta.stack : ""
    }\n`;
    console.error(
      chalk.blue(`[${this.serviceName}]`),
      chalk.red("❌"),
      message,
      meta ? chalk.gray(JSON.stringify(meta)) : ""
    );
    fs.appendFileSync(path.join(logsDir, "error.log"), logMessage);
  }
}

module.exports = new Logger();
