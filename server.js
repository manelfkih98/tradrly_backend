require("dotenv").config();

const express = require("express");
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
const app = express();
app.use(cookieParser());
const path = require('path');
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
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}, accessible à http://localhost:${PORT}${BASE_URL}`);
});
