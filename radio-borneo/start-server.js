const liveServer = require("live-server");
const params = {
  port: 8080,
  host: "127.0.0.1",
  root: ".",
  open: false,
  file: "index.html",
  wait: 500,
  logLevel: 2,
  ignore: ['node_modules', '.git'],
  noCssInject: true
};
liveServer.start(params);
console.log("Servidor iniciado en http://127.0.0.1:8080/");
