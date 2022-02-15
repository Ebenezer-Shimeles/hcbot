
const express = require("express")

const HC = require('./bot')
const startHeaders = require("./commands/start");
const unknownHeaders = require("./commands/unknown");
const creditsHeaders = require("./commands/credits")


const commands = { ...startHeaders, ...unknownHeaders, ...creditsHeaders }

app = express()
app.get('/', (req, res) => {
    res.end('ok')
})

app.use(express.json())
app.post('/', (req, res) => {
    HC.processUpdate(req.body)

    res.end("ok")
})

HC.on('message', (msg) => {
    if (msg.text.startsWith('/')) {
        //console.log("Lookup ", commands)
        if (commands[msg.text])
            commands[msg.text](HC, msg)
        else
            commands["unknown"](HC, msg)
    }
})

app.listen(8000, (e) => {
    if (e) console.error("Error " + e);
    console.log("Listening at 8000")
})