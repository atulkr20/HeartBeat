import express from "express";
import { Service } from "../models/Service.js";
import { CheckLog } from "../models/CheckLog.js";
import { rescheduleService, removeServiceSchedule } from "../cron/scheduler.js";

const router = express.Router();

router.post("/api/services", async (req, res) => {
  try {
    const { name, url, interval } = req.body || {};

    if (!name || !url || !interval) {
      return res.status(400).json({ error: "name, url, interval are required" });
    }

    const service = await Service.create({ name, url, interval });
    rescheduleService(service);
    return res.status(201).json(service);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create service" });
  }
});

router.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.json(services);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.put("/api/services/:id", async (req, res) => {
  try {
    const { name, url, interval } = req.body || {};
    if (!name && !url && !interval) {
      return res.status(400).json({ error: "name, url, or interval is required" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (url) updates.url = url;
    if (interval) updates.interval = interval;

    const service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    rescheduleService(service);
    return res.json(service);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/api/services/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    removeServiceSchedule(service._id);
    await CheckLog.deleteMany({ serviceId: service._id });

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete service" });
  }
});

router.get("/api/services/:id/logs", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const page = Math.max(1, Number.parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit || "20", 10)));
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      CheckLog.countDocuments({ serviceId }),
      CheckLog.find({ serviceId })
        .sort({ checkedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({
      page,
      limit,
      total,
      logs,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
