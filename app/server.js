var express = require("express")
var path = require('path')
var fs = require('fs')
var MongoClient = require('mongodb').MongoClient;
var app = express()
var dbUrl = "mongodb://admin:password@mongodb:27017?authSource=admin"

/*
 To do: DONE Write docker file (easy)
        DONE Write yaml (easy, but figure out what needs to go in it and why)
        DONE Test Writing/reading database

    Research Pusher - subscribe to pusher to get realtime changes
    Add to app, test to get realtime web changes

    Install Android studio
    Write Android app (interface and functions)
    Connect android app to node server and get database functionality
    Connect android app to pusher to get realtime changes

    Don't think it's possible to run android app from docker, so skip that

    Clean everything up and make it demoable
*/

app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/messages-logo", (req, res) => {
    let img = fs.readFileSync(path.join(__dirname, "logo.png"))
    res.writeHead(200, { "Content-Type": "image/png" })
    res.end(img, "binary")
})

app.get("/getMessages", (req, res) => {
    // res.send({ messages: [] })
    console.log(dbUrl)
    MongoClient.connect(
        dbUrl,
        (error, client) => {
            if (error) throw error;
            let db = client.db("docker-messages");
            db.collection("messages").find({}).toArray((err, result) => {
                if (err) throw error
                client.close()
                console.log(result)
                res.end(JSON.stringify(result))
            })
        })
})

app.post("/sendMessage", (req, res) => {
    let messageObj = req.body
    // res.send(messageObj)
    MongoClient.connect(
        dbUrl,
        (error, client) => {
            if (error) throw error;
            let db = client.db("docker-messages")
            db.collection("messages").insertOne(messageObj, (err, result) => {
                if (err) throw error;
                console.log("Message inserted");
                client.close()
                res.send(messageObj.messageTxt)
            })
        }
    )
})

app.listen(3000, () => {
    console.log("App listening on port 3000")
})