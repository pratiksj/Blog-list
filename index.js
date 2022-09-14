const app = require("./app");
const http = require("http");
const config = require("./utills/config");
const logger = require("./utills/logger");

const server = http.createServer(app);
server.listen(config.PORT, () => {
  logger.info(`Server running on port${config.PORT}`);
});
