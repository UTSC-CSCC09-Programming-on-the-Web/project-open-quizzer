const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
