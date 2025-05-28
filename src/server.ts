import express from "express";
import cluster from "cluster";
import os from "os";
import { PORT } from "./config";
import { RabbitInit } from "./config/RabbitInit";
import connectMongoDb from "./services/MongoDB";

const app = express();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (workers, code, signal) => {
    console.log(`Worker ${workers.process.pid} died`);
    console.log(`Forking a new worker...`);
    cluster.fork();
  });
} else {
  const startServer = () => {
    connectMongoDb();

    RabbitInit();

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} is listening on ${PORT}`);
    });
  };

  startServer();
}
