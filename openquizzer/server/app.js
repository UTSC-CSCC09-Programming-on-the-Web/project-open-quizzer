require("dotenv").config();
//creates the pool and logs 
require('./config/db'); 
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
//mounting student route
//const studentRoutes = require('./routes/student');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require("./routes/subscription");

const app = express();

app.use(cors());
//subscription routes in  our application
app.use('/webhook', subscriptionRoutes); 
app.use(express.json());

const apiRoutes = require("./routes");
app.use("/api", apiRoutes);
//student routes to interact with our application
//app.use('/api',studentRoutes);

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

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

//connecting check for db only when the app boots
const db = require('./config/db');
(async () => {
  try {
    const { rows } = await db.query('SELECT 1 AS ok');
    console.log('DB test query returned:', rows[0].ok); 
  } 
  catch (err) {
    console.error('DB connection failed!', err);
    process.exit(1); 
  }
  
})();



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
