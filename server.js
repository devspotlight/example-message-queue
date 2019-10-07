let express = require('express');
let RedisSMQ = require("rsmq");

let QUEUENAME = "testqueue";
let NAMESPACE = "rsmq";

let raw_url = new URL(process.env.REDIS_URL);
let REDIS_HOST=raw_url.hostname;
let REDIS_PORT=raw_url.port;
let REDIS_PASSWORD=raw_url.password;
let PORT = process.env.PORT;
let app = express();

let rsmq = new RedisSMQ({
        host: REDIS_HOST,
        port: REDIS_PORT,
        ns: NAMESPACE,
        password: REDIS_PASSWORD
    });

rsmq.createQueue({qname: QUEUENAME}, (err) => {
    if (err) {
        if (err.name !== "queueExists") {
            console.error(err);
            return;
        } else {
            console.log("The queue exists. That's OK.");
        }
    }
    console.log("queue created");
});

// send the index.html
app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname}));

// add the job to the work queue
app.post('/job', async(req, res) => {
    console.log("sending message");
    rsmq.sendMessage({
        qname: QUEUENAME,
        message: `Hello World at ${new Date().toISOString()}`,
        delay: 0
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    console.log("pushed new message into queue");
});

app.listen(PORT, () => console.log("Server started!"));