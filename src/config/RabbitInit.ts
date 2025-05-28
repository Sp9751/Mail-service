import { queueConsumer } from "../controllers/mailSending.controller";
import RabbitMQ from "../services/RabbitMQ";

export const RabbitInit = async () => {
  try {
    await RabbitMQ.connect();
    queueConsumer();
  } catch (error: any) {
    console.log("Error initializing services: ", error);
    process.exit(1);
  }
};
