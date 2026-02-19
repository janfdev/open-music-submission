import express from "express";
import "dotenv/config";
import server from "./routes/index.js";
import ErrorHandler from "./middlewares/error.js";

const app = express();

app.use(express.json());
app.use(server);

// Routes
app.get("/", (req, res) => {
  res.send("Hai API sudah berjalan");
});

// Error Handling
app.use(ErrorHandler);

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server berjalan pada port http://${HOST}:${PORT}`);
});
