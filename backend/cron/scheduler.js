import cron from "node-cron";
import axios from "axios";
import { Service } from "../models/Service.js";
import { CheckLog } from "../models/CheckLog.js";

const tasks = new Map();

function buildCronExpression(seconds) {
  const safeSeconds = Math.max(5, Math.min(600, Number(seconds)));
  return `*/${safeSeconds} * * * * *`;
}

async function runCheck(service) {
  const startedAt = Date.now();
  let status = "DOWN";
  let responseTime = 0;

  try {
    const response = await axios.get(service.url, { timeout: 5000 });
    responseTime = Date.now() - startedAt;
    status = response.status >= 200 && response.status < 400 ? "UP" : "DOWN";
  } catch (err) {
    responseTime = Date.now() - startedAt;
    status = "DOWN";
  }

  await CheckLog.create({
    serviceId: service._id,
    status,
    responseTime,
    checkedAt: new Date(),
  });
}

function scheduleService(service) {
  const cronExpr = buildCronExpression(service.interval);
  const task = cron.schedule(cronExpr, () => runCheck(service));
  task.start();
  tasks.set(service._id.toString(), { task, interval: service.interval });
}

function clearAllTasks() {
  for (const { task } of tasks.values()) {
    task.stop();
  }
  tasks.clear();
}

export async function loadAndScheduleAll() {
  clearAllTasks();
  const services = await Service.find();
  services.forEach(scheduleService);
}

export function rescheduleService(service) {
  const key = service._id.toString();
  const existing = tasks.get(key);
  if (existing) {
    existing.task.stop();
    tasks.delete(key);
  }
  scheduleService(service);
}

export function removeServiceSchedule(serviceId) {
  const key = serviceId.toString();
  const existing = tasks.get(key);
  if (existing) {
    existing.task.stop();
    tasks.delete(key);
  }
}
