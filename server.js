require("dotenv").config();

const express = require("express");
const http = require("http"); // Ajouté
const { Server } = require("socket.io"); // Ajouté

const connectDB = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const adminRoutes = require("./routers/adminRoutes");
const departRoutes = require("./routers/departementRoutes");
const offreRoutes = require("./routers/offreRoutes");
const articleRoutes = require('./routers/articleRoutes');
const postRoutes = require("./routers/postRoutes");
const projectRoutes = require("./routers/projectRoutes");
const reponceRoutes = require("./routers/reponceRoutes");
const propoRoutes = require("./routers/propositionRoutes");
const questionRoutes = require('./routers/questionRoutes');
const qcmRoutes = require('./routers/qcmRoutes');
const teamMemberRoutes = require('./routers/teamMemberRoutes');
const contactRoutes = require('./routers/contactRoutes');

const path = require('path');

const app = express();
const server = http.createServer(app); // Utiliser HTTP Server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // à adapter selon ton front React admin
    methods: ["GET", "POST"]
  }
});

// === Connexion Socket.IO ===
io.on("connection", (socket) => {
  console.log("✅ Admin connecté via Socket.IO :", socket.id);
});

app.set("socketio", io); 

app.use(cookieParser());
app.use(cors());
app.use(express.json());
connectDB();

const PORT = process.env.PORT || 3000;
const BASE_URL = "/tradrly/api/v1";  

app.use(`${BASE_URL}/project`, projectRoutes);
app.use(`${BASE_URL}/admin`, adminRoutes);
app.use(`${BASE_URL}/depart`, departRoutes);
app.use(`${BASE_URL}/offre`, offreRoutes);
app.use(`${BASE_URL}/article`, articleRoutes);
app.use(`${BASE_URL}/post`, postRoutes);
app.use(`${BASE_URL}/reponce`, reponceRoutes);
app.use(`${BASE_URL}/propos`, propoRoutes);
app.use(`${BASE_URL}/question`, questionRoutes);
app.use(`${BASE_URL}/qcm`, qcmRoutes);
app.use(`${BASE_URL}/team`, teamMemberRoutes);
app.use(`${BASE_URL}/contact`, contactRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}${BASE_URL}`);
});
