const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");

const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/ai", aiRoutes);
const successProfileRoutes = require("./routes/successProfileRoutes");

app.use("/api/success-profiles", successProfileRoutes);


app.use("/api/employees", employeeRoutes);
const gapAnalysisRoutes = require("./routes/gapAnalysisRoutes");

app.use("/api/gap-analysis", gapAnalysisRoutes);
module.exports = app;