import express, { Application, Request, Response } from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);

app.get("/health-check", (req, res) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const healthcheck = {
    service: "Admin Service",
    message: "Admin server is Healthy ✅",
    branchName: "main",

    timestamp: new Date().toLocaleString(),

    uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = String(error);
    res.status(503).send();
  }
});

export default app;
