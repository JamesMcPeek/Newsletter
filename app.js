const bodyParser = require("body-parser");
const express = require("express")
//const request = require("request");
const https = require("https");

const app = express();

// apiKey = 4a0a25148106b94bcd40afad14e6fc9b-us20;
// listId = cdb20e24b2

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req,res){
    res.sendFile(__dirname + "/signup.html")
    console.log("server up")
})

app.post('/', function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us20.api.mailchimp.com/3.0/lists/cdb20e24b2"
    const options = {
        method: "POST",
        auth: "jmp:4a0a25148106b94bcd40afad14e6fc9b-us20"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log("signed up");
        })
    })

    request.write(jsonData);
    request.end();


});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("Listening on port 3000")
})