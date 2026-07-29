const express = require("express");
const cors = require("cors");

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
const successProfileRoutes = require("./routes/successProfileRoutes");

app.use("/api/success-profiles", successProfileRoutes);

app.use("/api/employees", employeeRoutes);
const gapAnalysisRoutes = require("./routes/gapAnalysisRoutes");

app.use("/api/gap-analysis", gapAnalysisRoutes);
module.exports = app;