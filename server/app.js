import express, { json } from "express";
import cors from "cors";

import txRoutes from "./routes/tx.routes";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/tx", txRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
