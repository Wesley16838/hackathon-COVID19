const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const configRoutes = require("./routes");
const path = require('path')
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

configRoutes(app);
app.use(express.static('public'));

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'public','index.html'))
})
const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:5000");
});