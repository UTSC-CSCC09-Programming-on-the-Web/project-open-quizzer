require("dotenv").config();
//creates the pool and logs
require("./config/db");
const express = require("express");
const cors = require("cors");
const quizModel = require("./models/quizModel");

//connecting check for db only when the app boots
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

const http = require("http");
const { Server } = require("socket.io");
//creates the pool and logs

const app = express();

app.use(cors());
//subscription routes in  our application
const subscriptionRoutes = require("./routes/subscription");
app.use('/webhook', subscriptionRoutes);

app.use(express.json());

const quizRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/payment");
const googleAuthRoutes = require("./routes/google_auth");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", quizRoutes);
app.use("/api/auth", googleAuthRoutes);
//payment routes to our app subscription
app.use('/api', paymentRoutes);

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
  socket.on("join-quiz", async (data) => {
    try {
      const { quizCode, nickname } = data;
      const quiz = await quizModel.getQuizById(quizCode);
      if (!quiz) {
        socket.emit("join-error", { message: "Quiz not found" });
        return;
      }
      if (quiz.status !== "active") {
        socket.emit("join-error", { message: "Quiz is not active" });
        return;
      }
      // joining quiz room
      socket.join(`quiz-${quizCode}`);
      // Store info in socket
      socket.quizCode = quizCode;
      socket.nickname = nickname || "Anonymous";
      socket.to(`quiz-${quizCode}`).emit("participant-joined", {
        nickname: socket.nickname,
        socketId: socket.id,
      });
      // Send details to the quiz taker
      socket.emit("quiz-joined", {
        quizId: quiz.id,  
        title: quiz.title,
      });
      console.log(`${socket.nickname} joined quiz ${quizCode}`);
    } catch (error) {
      console.error("Error joining quiz:", error);
      socket.emit("join-error", { message: "Failed to join quiz" });
    }
  });

  // Handle quiz taker submitting answer
  socket.on("submit-answer", async (data) => {
    try {
      const { answer } = data;
      const { quizCode, nickname } = socket;

      if (!quizCode || !answer) {
        socket.emit("answer-error", { message: "Invalid submission" });
        return;
      }
      // Store quiz answer from quiz taker
      const answerData = {
        quizCode,
        nickname,
        answer,
        timestamp: new Date(),
        socketId: socket.id,
      };
      // Broadcast quiz master that answer was submitted
      socket.to(`quiz-${quizCode}`).emit("answer-submitted", answerData);
      socket.emit("answer-confirmed", {
        message: "Answer submitted successfully",
      });
      console.log(`${nickname} submitted answer for quiz ${quizCode}`);
    } catch (error) {
      console.error("Error submitting answer:", error);
      socket.emit("answer-error", { message: "Failed to submit answer" });
    }
  });

  // Handle quiz master activating quiz
  socket.on("activate-quiz", (quizId) => {
    socket.join(`quiz-${quizId}`);
    socket.quizId = quizId;
    console.log(`Quiz master activated quiz ${quizId}`);
  });

  // Handle quiz master closing quiz
  socket.on("close-quiz", (quizId) => {
    // Notify all participants that quiz is closed
    io.to(`quiz-${quizId}`).emit("quiz-closed", {
      message: "Quiz has been closed by the instructor",
    });

    // Remove everyone from the room
    io.in(`quiz-${quizId}`).socketsLeave(`quiz-${quizId}`);
    console.log(`Quiz ${quizId} closed`);
  });

  socket.on("disconnect", () => {
    if (socket.quizCode && socket.nickname) {
      // Notify quiz master that participant left
      socket.to(`quiz-${socket.quizCode}`).emit("participant-left", {
        nickname: socket.nickname,
        socketId: socket.id,
      });
    }
    console.log("socket disconnected:", socket.id);
  });
});

//connecting check for db only when the app boots
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
