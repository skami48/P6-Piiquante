const http = require("http");
const app = require("./app");

// eslint-disable-next-line no-undef
app.set("port",process.env.PORT || 3000);

const server = http.createServer(app);


// eslint-disable-next-line no-undef
server.listen(process.env.PORT || 3000);