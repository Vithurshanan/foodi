const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8080;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());

///mongodb+srv://foodi-server:QVtBxFa2J7yiWsiz@cluster0.3uhfulu.mongodb.net/

// mongodb config 







    //all cart operations 









app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})