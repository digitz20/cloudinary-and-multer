const express = require('express')
require('./config/database')
const userRouter = require('./routes/userRouter')

const PORT = process.env.PORT || 2049

const app = express()

app.use(express.json())

app.use(userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})