const express = require('express')
const cors = require('cors')

require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const campRoutes = require('./routes/campRoutes')
const socialRoutes = require('./routes/socialRoutes')
const competitionRoutes = require('./routes/competitionRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth',authRoutes)
app.use('/camp', campRoutes)
app.use('/camp', competitionRoutes)
app.use('/camp/social', socialRoutes)
app.use('/admin', adminRoutes)


app.listen(3000, () => {
  console.log('Server running on port 3000')
})
