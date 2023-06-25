const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const file = fs.createWriteStream("./image");
app.use(express.static(path.join(__dirname , 'static')));
app.post("/upload" , (req , res) => {
    console.log(req.headers);
    req.pipe(file , {
        end : false
    });
    res.send("got the file thank you for labeling!!");
});
app.listen(80  , (err) =>{
    if(err){
        console.error(err);
    }else{
        console.log("listening to the port 80");
    }
} );