// const express = require("express");
// const connectToMongo = require("./config/db.js");
// const userRoutes = require("./routes/userRoutes.js");
// const adminRoutes = require("./routes/adminRoutes.js");
// const contactUs = require("./routes/contactUs.js");
// const seederRoutes = require("./routes/seederRoutes.js");
// const jobRoutes = require("./routes/jobRoutes.js");
// const category = require("./routes/categoryroutes.js");
// const proposalRoutes = require("./routes/proposalRoutes.js");
// const favoriteRoutes = require("./routes/addToFavorite.js");
// const chatRoutes = require("./routes/chatRoutes.js");
// const messageRoutes = require("./routes/messageRoutes.js");
// const http = require('http')
// const socketIo = require("socket.io");
// const errorMiddleware = require("./middleware/errorMiddleware.js");
// const app = express();
// const bodyParser = require("body-parser");
// const port = 3000;
// const cors = require("cors");
// const fileUpload = require("express-fileupload");
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// connectToMongo();

// const server = http.createServer(app);
// const io = socketIo(server); 

// app.use(
//   cors({
//     origin: "http://localhost:3001",
//     optionsSuccessStatus: 200,
//   })
// );
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

// app.get("/", (req, res, next) => {
//   return res.status(200).json({
//     message: "worked  fine",
//   });
// });

// app.use(
//   "/api",
//   userRoutes,
//   adminRoutes,
//   contactUs,
//   category,
//   seederRoutes,
//   jobRoutes,
//   proposalRoutes,
//   chatRoutes,
//   messageRoutes,
//   favoriteRoutes,
//   (req, res, next) => {
//     res.status(404).json({
//       success: false,
//       message: "Page not found",
//       error: {
//         statusCode: 404,
//         message: "You reached a route that is not defined on this server",
//       },
//     });
//   }
// );

// app.use(errorMiddleware.errorMiddleware);

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Listen for real-time messages and broadcast them
//   socket.on("sendMessage", (data) => {
//     // Process the message (save to database, etc.)

//     // Broadcast the message to the relevant chat room
//     socket.join(data.chatId); // Join the chat room
//     io.to(data.chatId).emit("newMessage", data);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

// app.listen(port, () => {
//   console.log("Port working");
// });

const express = require("express");
const connectToMongo = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const contactUs = require("./routes/contactUs.js");
const seederRoutes = require("./routes/seederRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const category = require("./routes/categoryroutes.js");
const proposalRoutes = require("./routes/proposalRoutes.js");
const favoriteRoutes = require("./routes/addToFavorite.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const errorMiddleware = require("./middleware/errorMiddleware.js");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const socketIo = require("socket.io");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectToMongo();

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  })
);

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Basic route
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "worked fine",
  });
});

// API routes
app.use(
  "/api",
  userRoutes,
  adminRoutes,
  contactUs,
  category,
  seederRoutes,
  jobRoutes,
  proposalRoutes,
  chatRoutes,
  messageRoutes,
  favoriteRoutes,
  (req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Page not found",
      error: {
        statusCode: 404,
        message: "You reached a route that is not defined on this server",
      },
    });
  }
);

// Error handling middleware
app.use(errorMiddleware.errorMiddleware);

// Create an HTTP server using Express
const server = app.listen(port, () => {
  console.log("Server is running on port", port);
});

// Socket.io connection handling
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Socket.io event handlers
  socket.on("sendMessage", (data) => {
    // Process and broadcast the message
    socket.join(data.chatId); // Join the chat room
    io.to(data.chatId).emit("newMessage", data);
    console.log("chat id:", chatId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

