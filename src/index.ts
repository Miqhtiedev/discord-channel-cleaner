if (process.env.NODE_ENV !== "production") require("dotenv").config();
import { AxiosError } from "axios";
import getMessages, { Message } from "./getMessages";
import logFlaggedMessage from "./logFlaggedMessages";
import logger from "./logger";
import { containsFlaggedTerm, populateFlaggedTerms } from "./wordFlagger";
import readline from "readline-sync";
import deleteMessage from "./deleteMessage";

populateFlaggedTerms("./flaggedWords.txt");
const flaggedMessages: Message[] = [];

const cap = parseInt(readline.question("Enter message cap "));
if (isNaN(cap)) {
  console.log("Invalid input");
  process.exit(0);
}

const channelId = readline.question("Enter channel id ")
const firstMessage = readline.question("Enter id for first message ");
const deleteResponse = readline.question("Should messages be deleted Y/N (default no) ").toLowerCase();
const deleteMessages = deleteResponse === "y" || deleteResponse === "yes";
let completedLog = false;

console.log(`Messages will ${!deleteMessages ? "not" : ""} be deleted`);

let fetched = 0;
const clean = async (messageId: string) => {
  getMessages(messageId, channelId)
    .then(async (messages) => {
      fetched += messages.length;
      logger.info(`Fetched messages totalling ${fetched}/${cap} [${Math.round((fetched / cap) * 10) / 10}]`);
      for (const message of messages) {
        if (containsFlaggedTerm(message.content)) {
          logger.info(`Flagged ${message.id}`);
          flaggedMessages.push(message);
          if (deleteMessages) {
            await deleteMessage(message.id, channelId);
          }
        }
      }

      if (fetched < cap && messages.length > 0)
        setTimeout(() => clean(messages[0].id), Math.floor(Math.random() * 500) + 750);
      else {
        logFlaggedMessage(flaggedMessages);
      }
    })
    .catch((err: AxiosError) => {
      if (err.response?.status === 429) {
        const retry = Math.floor(Math.random() * 1000) + 2000;
        logger.warn(`Ratelimited for ${messageId}, retrying in ${retry}ms`);
        setTimeout(() => {
          clean(messageId);
        }, retry);
      } else {
        logger.error(`Error fetching ${messageId}`);
        logger.error(err);
        logFlaggedMessage(flaggedMessages);
        completedLog = true;
      }
    });
};

logger.info(`Cleaning started for channel ${channelId}`);
clean(firstMessage);

const start = Date.now();
process.on("exit", () => {
  if (!completedLog) logFlaggedMessage(flaggedMessages);
  logger.info(`Process exited after ${Date.now() - start}ms`);
});