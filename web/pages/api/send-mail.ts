// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_newAPIKey);

async function _(req, res) {
    //
    // await Mailer.on("token", console.log);
    // await Mailer.sendMail({
    //   from: 'Kabeer Chats <chats-no-reply@kabeersnetwork.tk>', // sender address
    //   to: [req.query.guest, req.query.u].join(", "), // list of receivers
    //   subject: req.query.u + " Added you to a new chat!", // Subject line
    //   text: req.query.u + " Added you to a new chat!, Reply at https://chats.kabeersnetwork.tk", // plain text body
    // })
    res.status(200).json({0: true})
}

export default async (req, res) => {
    // analytics.logEvent("send_email");
    const msg = {
        to: req.query.guest, //[req.query.guest, req.query.u].join(", "), // Change to your recipient
        cc: req.query.u,
        from: 'Kabeer Chats <chats-no-reply@kabeers.network>', // Change to your verified sender
        subject: req.query.u + " Added you to a new chat!",
        html: req.query.u + " Added you to a new chat!, Reply at <a href=\"https://chats.kabeers.network\">chats.kabeers.network</a>",
    }
    sgMail
        .send(msg)
        .then((a) => {
            console.log(a);
            res.json('Email sent')
        })
        .catch((error) => {
            res.status(500).json(error)
        })
}