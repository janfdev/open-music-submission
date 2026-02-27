import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import amqp from "amqplib";
import PlaylistsService from "./PlaylistsService.js";
import MailSender from "./MailSender.js";
import Listener from "./Listener.js";

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlist", {
    durable: true,
  });

  channel.consume("export:playlist", listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada queue export:playlist`);
};

init().catch((error) => {
  console.error("Error initializing consumer:", error);
});
