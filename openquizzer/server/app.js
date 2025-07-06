const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("OpenQuizzer backend is up and running!");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

const db = require("./config/db");
(async () => {
  try {
    const { rows } = await db.query("SELECT 1 AS ok");
    console.log("DB test query returned:", rows[0].ok);
  } catch (err) {
    console.error("DB connection failed!", err);
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
