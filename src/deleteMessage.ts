import axios from "axios";
import logger from "./logger";

const deleteMessage = (messageId: string, channelId: string): Promise<boolean> => {
  logger.info("Deleteing mesage id " + messageId);
  return new Promise((res, rej) => {
    axios
      .delete(`https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`, {
        headers: { Authorization: process.env.AUTHORIZATION },
      })
      .then(() => {
        logger.info("Deleted mesasge id " + messageId);
        res(true);
      })
      .catch((err) => {
        logger.info("Failed to delete message id " + messageId);
        console.log(err);
        
        res(false);
      });
  });
};

export default deleteMessage;
