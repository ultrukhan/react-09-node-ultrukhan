const express = require("express");

const DEFAULT_INTERVAL = 100;
const DEFAULT_TIMEOUT = 700;

const readArg = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;
  const value = parseInt(process.argv[index + 1], 10);
  return Number.isNaN(value) || value <= 0 ? fallback : value;
};

const interval = readArg("-i", DEFAULT_INTERVAL);
const timeout = readArg("-t", DEFAULT_TIMEOUT);

console.log(`interval: ${interval} timeout: ${timeout}`);

const app = express();

app.get("/", (req, res) => {
  let timer;
  const stop = setTimeout(() => {
    clearInterval(timer);
    res.send(`Зараз ${new Date().toUTCString()}.`);
  }, timeout);
  timer = setInterval(() => {
    console.log(new Date());
  }, interval);
  res.on("close", () => {
    clearTimeout(stop);
    clearInterval(timer);
  });
});

const server = app.listen(process.env.PORT || 3000);

module.exports = { app, server };
