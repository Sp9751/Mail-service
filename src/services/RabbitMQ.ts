import amqp, { Channel } from "amqplib";
import { QUEUE_NAME, RABBITMQ_URI } from "../config";

class RabbitMQ {
  private connection: any | null = null;
  private channel: Channel | null = null;

  constructor() {}

  async connect() {
    try {
      this.connection = await amqp.connect(RABBITMQ_URI);
      this.channel = await this.connection?.createChannel();
      await this.channel?.assertQueue(QUEUE_NAME, { durable: true });
      this.channel?.prefetch(1);
      console.log("Connect to RabbitMQ");
    } catch (error: any) {
      console.error("Error facing to connect to rabbitMQ", error.message);
    }
  }

  async consume(callback: (message: any) => void) {
    try {
      this.channel?.consume(
        QUEUE_NAME,
        (msg) => {
          if (msg !== null) {
            callback(JSON.parse(msg.content.toString()!));
            this.channel?.ack(msg);
          }
        },
        {
          noAck: false,
        }
      );
    } catch (error: any) {
      console.error(
        "Error facing to consume messages from queue",
        error.message
      );
    }
  }

  async closeConnection() {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log("RabbitMQ connection closed");
      process.exit(0);
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
      process.exit(1);
    }
  }
}

export default new RabbitMQ();
