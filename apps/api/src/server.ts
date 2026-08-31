import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import healthRouter from "./routes/health.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import memberRoutes from "./routes/member.routes.js";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use(
  "/api/workspaces/:id/members",
  memberRoutes,
);

app.listen(PORT, () => {
  console.log(`Stud.xo API running on http://localhost:${PORT}`);
});



