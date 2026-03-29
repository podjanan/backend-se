const express = require('express')
const cors = require('cors')

require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require("./routes/adminRoutes");

const campRoutes = require("./routes/campRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const socialRoutes = require("./routes/socialRoutes");

const reviewRoutes = require("./routes/reviewRoutes");
const campReviewRoutes = require('./routes/campreviewRoutes');

const userRoutes = require("./routes/userRoutes");

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth',authRoutes)
app.use("/api/admin", adminRoutes);

app.use("/api/camps", campRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/social", socialRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/reviews", reviewRoutes);
app.use("/api/camps/:camp_id/reviews", campReviewRoutes);

app.use("/api/users", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
