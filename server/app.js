import express, { json } from "express";
import cors from "cors";

import txRoutes from "./routes/tx.routes.js";

import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/tx", txRoutes);
app.use("/api/agent", agentRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
