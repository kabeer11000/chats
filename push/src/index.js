const express = require("express");
const webpush = require("web-push");
const app = express();
const cors = require("cors");
app.use(express.json({inflate: true}));
app.use(cors());
const vapidKeys = require("./vapid.json");
webpush.setVapidDetails('mailto:support@kabeersnetwork.tk', vapidKeys.public_key, vapidKeys.private_key);

app.post("/send-notification", async (req, res) => {
    try {
        //get push subscription object from the request
        const {subscriptions, user, message, senderImage, data, url} = req.body;
        console.log("push notification requested", subscriptions.length);

        //create payload: specified the details of the push notification
        const payload = JSON.stringify({
            title: user, body: message, data: {
                url: url,
                ...data
            }, icon: senderImage ?? null
        });
        for (const sub of subscriptions.reverse()) {
            //pass the object into sendNotification function and catch any error a
            webpush.sendNotification(sub, payload).catch(err => console.error(err, "\n\n--------"));
        }
        //send status 201 for the request
        res.status(200).json({status: true});
    } catch (e) {
        //send status 201 for the request
        res.status(500).json({status: false});
    }
});
app.post("/v2/call/dispatch", async (req, res) => {
    try {
        const {subscriptions, ...data} = req.body;
        const response = [];
        // console.log(data);
        // return res.json({});
        for (const sub of [...new Set(subscriptions)].reverse()) {
            await webpush.sendNotification(sub, JSON.stringify({
                ...data, type: "kn.chats.conversation.call.notification"
            }))
                .catch(err => {
                    console.log({e: err.body})
                    response.push({pushed: false, e: err.body});
                })
                .then((a) => {
                    console.log("sent notification", a?.statusCode, a?.body);
                    response.push({pushed: !!a})
                });
        }
        res.status(200).json({status: true, responses: response});
    } catch (e) {
        console.log(e);
        res.status(500).json({status: false});
    }
});


// "kn.chats.conversation.text.notification"
// "kn.chats.conversation.call.notification"
// "kn.chats.general.notification"
// "kn.chats.action.notification";
app.post("/v2/text/dispatch", async (req, res) => {
    try {
        const {subscriptions, ...data} = req.body;
        const response = [];
        for (const sub of [...new Set(subscriptions)].reverse()) {
            console.log(sub)
            await webpush.sendNotification(sub, JSON.stringify({
                ...data, type: "kn.chats.conversation.text.notification"
            }))
                .catch(err => {
                    console.log({e: err.body})
                    response.push({pushed: false, e: err.body});
                })
                .then((a) => {
                    console.log("sent notification", a?.statusCode, a?.body);
                    response.push({pushed: !!a})
                });
        }
        res.status(200).json({status: true, responses: response});
    } catch (e) {
        console.log(e);
        res.status(500).json({status: false});
    }
});


app.get("/test/dispatch", async (req, res) => {
    const d = 'hello';
    /*
    || {"type": "kn.chats.conversation.text.notification",
        "payload": {
            "user": {"name": "String", "photo": "String", "id": "String"},
            "chat": {"id": "String", "url": "String"},
            "data": {"message": "String"}
        }
    }
     */
    const subChrome = {
        "endpoint": "https://fcm.googleapis.com/fcm/send/covVhlqO0ow:APA91bFWnnVXx-zIO_sfnRQXfORIz_mWTqyrI1VVrZztg3dL-6Uk9EkXMB9RA1zXt_89qvz0hQROKeffodAeSg-D7nzyVgVkvp2ZlIZsSuJ6xtJwFhsDYvFd-0s1MHrQ1Ek0RAu8InpX",
        "expirationTime": null,
        "keys": {
            "p256dh": "BCed7BI8fwQsxYwICzj6HZcDA4ZqCzh5eu_U1_60I-G-GkPyvxdI6QF5VvFJ01do74U8n0YP8xvRnCE61LC4bYs",
            "auth": "viv_2qkd6ODdYb3ibOr7qw"
        }
    }
    const response = [];
    try {
        await webpush.sendNotification(subChrome, JSON.stringify(d))
        response.push({pushed: true})
    } catch (e) {
        response.push({pushed: false, e})
    }
    res.status(200).json({status: true, responses: response});
})

app.listen(process.env.PORT || 5001, () => {
    console.log("server started on http://localhost:" + (process.env.PORT || 5001))
});