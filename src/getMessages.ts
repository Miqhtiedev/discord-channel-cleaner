import axios from "axios";
import logger from "./logger";

export interface Message {
  content: string;
  id: string;
}

const getMessages = (messageId: string, channelId: string): Promise<Message[]> => {
  logger.info(`Creating request for id ${messageId}`);
  return new Promise((resolve, reject) => {
    axios
      .get(`https://discord.com/api/v9/channels/${channelId}/messages?after=${messageId}&limit=100`, {
        headers: { Authorization: process.env.AUTHORIZATION },
      })
      .then((res) => {
        if (res.status === 200) resolve(res.data);
        reject(res.data);
      })
      .catch(reject);
  });
};

export default getMessages;
