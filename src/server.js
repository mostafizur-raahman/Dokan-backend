import cluster from "cluster";
import os from "os";
import http from "http";
import crypto from "crypto";
import app from "./app.js";
import config from "./config/config.js";

const PORT = config.PORT;
const totalCPUs = os.cpus().length;
let workerCount = 1;
if (typeof global.crypto === "undefined") {
    global.crypto = crypto;
}

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(
        `📦 Detected ${totalCPUs} CPUs, forking ${totalCPUs} workers...`,
    );

    // Track active workers
    const activeWorkers = new Map();

    // Fork workers
    for (let i = 0; i < totalCPUs; i++) {
        const worker = cluster.fork();
        activeWorkers.set(worker.id, {
            pid: worker.process.pid,
            status: "starting",
        });
    }
    cluster.on("online", (worker) => {
        console.log(
            `Worker ${worker.id} (PID: ${worker.process.pid}) is ONLINE`,
        );
        activeWorkers.set(worker.id, {
            pid: worker.process.pid,
            status: "online",
            uptime: Date.now(),
        });
        logWorkerStatus(activeWorkers);
    });

    cluster.on("exit", (worker, code, signal) => {
        const info = activeWorkers.get(worker.id);
        console.log(`Worker ${worker.id} (PID: ${worker.process.pid}) died:`, {
            code,
            signal,
            uptime: info?.uptime
                ? `${Math.floor((Date.now() - info.uptime) / 1000)}s`
                : "N/A",
        });
        activeWorkers.delete(worker.id);

        // Restart worker
        console.log(`Restarting worker ${worker.id}...`);
        const newWorker = cluster.fork();
        activeWorkers.set(newWorker.id, {
            pid: newWorker.process.pid,
            status: "starting",
        });

        logWorkerStatus(activeWorkers);
    });

    const logWorkerStatus = (workers) => {
        const online = Array.from(workers.values()).filter(
            (w) => w.status === "online",
        ).length;
        console.log(`Active Workers: ${online}/${totalCPUs}`);
        console.log(
            `   ${Array.from(workers.entries())
                .map(([id, w]) => `[#${id} PID:${w.pid} ${w.status}]`)
                .join(" ")}`,
        );
    };
    setInterval(() => {
        logWorkerStatus(activeWorkers);
    }, 30000);
} else {
    // Worker process
    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(
            `Worker ${cluster.worker.id} (PID: ${process.pid}) listening on port ${PORT}`,
        );
    });

    process.on("SIGTERM", () => {
        console.log(
            `Worker ${cluster.worker.id} received SIGTERM, shutting down...`,
        );
        server.close(() => {
            console.log(`Worker ${cluster.worker.id} closed HTTP server`);
            process.exit(0);
        });
    });
}
