import express from "express";
import "dotenv/config";
import server from "./routes/index.js";
import response from "./utils/response.js";

const app = express();

app.use(express.json());
app.use(server);

// Routes

app.get("/", (req, res) => {
  res.send("Hai API sudah berjalan");
});

// Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;

  return response(res, statusCode, err.message, null);
});

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server berjalan pada port http://${HOST}:${PORT}`);
});
