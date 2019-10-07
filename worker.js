let RedisSMQ = require("rsmq");

let QUEUENAME = "testqueue";
let NAMESPACE = "rsmq";

let raw_url = new URL(process.env.REDIS_URL);
let REDIS_HOST=raw_url.hostname;
let REDIS_PORT=raw_url.port;
let REDIS_PASSWORD=raw_url.password;

let rsmq = new RedisSMQ({
        host: REDIS_HOST,
        port: REDIS_PORT,
        ns: NAMESPACE,
		password: REDIS_PASSWORD
    });

function start() {
	// check for new messages on a delay
	console.log("worker started");
	setInterval(() => {
		console.log("Checking for job");
		rsmq.receiveMessage({ qname: QUEUENAME }, (err, resp) => {
			if (err) {
				console.error(err);
				return;
			}
			if (resp.id) {
				console.log("Hey I got the message you sent me!");
				// do lots of processing here
				// when we are done we can delete it
				rsmq.deleteMessage({ qname: QUEUENAME, id: resp.id }, (err) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log("deleted message with id", resp.id);
				});
			} else {
				console.log("no message in queue");
			}
		});
	}, 2000);
}

start();