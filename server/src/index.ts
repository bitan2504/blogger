import "dotenv/config";

import cluster from "cluster";
import { availableParallelism } from "os";
import process from "process";
import app from "./app.js";

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
        );
    });
} else {
    const port = process.env.PORT || 3000;
    const nodeEnv = process.env.NODE_ENV || "development";
    
    console.log(`Worker ${process.pid} started`);

    app.listen(port, () => {
        console.log(
            `[${nodeEnv.toUpperCase()}] Server is running on port ${port}`
        );
        if (nodeEnv === "development") {
            console.log(
                `CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`
            );
        }
    });

}
