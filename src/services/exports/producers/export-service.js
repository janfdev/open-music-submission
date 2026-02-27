import amqp from "amqplib";

const exportService = {
  sendExportPlaylist: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue("export:playlist", {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default exportService;
