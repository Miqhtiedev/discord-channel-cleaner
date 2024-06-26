import { Message } from "./getMessages";
import fs from "fs";
import logger from "./logger";
import { resolve as pathResolve } from "path";

const logFlaggedMessage = (messages: Message[]) => {
  const path = "./logs/" + Date.now().toString() + ".log";

  fs.closeSync(fs.openSync(path, "w"));

  const file = fs.createWriteStream(path);
  messages.forEach((m) => file.write(`${JSON.stringify(m)}\n`));
  file.end();

  logger.info(`Log created for total ${messages.length} flagged words at ${pathResolve(file.path.toString())}`);
};

export default logFlaggedMessage;
