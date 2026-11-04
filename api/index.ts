import type { Express } from "express";

const app = require("../dist/index.js").default as Express;

export default app;
