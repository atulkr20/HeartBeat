import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, '.env') });

import servicesRouter from "./routes/services.js";
import { loadAndScheduleAll } from "./cron/scheduler.js";
import { CheckLog } from "./models/CheckLog.js";
import { Service } from "./models/Service.js";

const app = express();
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/heartbeat";
const PORT = process.env.PORT || 10000;

// API routes
app.use('/api', servicesRouter);

app.get("/api/dashboard", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    const results = [];

    for (const service of services) {
      const last = await CheckLog.findOne({ serviceId: service._id })
        .sort({ checkedAt: -1 })
        .lean();
      const recent = await CheckLog.find({ serviceId: service._id })
        .sort({ checkedAt: -1 })
        .limit(5)
        .lean();
      results.push({
        service: {
          _id: service._id.toString(),
          name: service.name,
          url: service.url,
          interval: service.interval,
        },
        last,
        recent,
      });
    }

    return res.json(results);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

async function start() {
  await mongoose.connect(mongoUrl);
  await loadAndScheduleAll();

  app.listen(PORT, () => {
    console.log(`Heartbeat running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
