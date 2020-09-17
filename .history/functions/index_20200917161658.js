const functions = require('firebase-functions');
require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const sgMail = require('@sendgrid/mail')
const port = 5000;

sgMail.setApiKey("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")

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID,
//   key: process.env.PUSHER_APP_KEY,
//   secret: process.env.PUSHER_APP_SECRET,
//   cluster: process.env.PUSHER_APP_CLUSTER,
//   useTLS: true,
// });

app.post("/send-message", (req, res) => {
  const { email,message,mailSubject,firstName,lastName,phone,accountBalance } = req.body;
  const msg = {
    to: email,
    from: 'nas@grupa.io',
    subject: mailSubject,
    html: `
      <p>${message}</p>
      <p>First Name:${firstName}</p>
      <p>Last Name:${lastName}</p>
      <p>Phone Number:${phone}</p>
      <p>Your account balance is:${accountBalance}</p>
      
    `,
  };

  sgMail.send(msg)
    .then(() => {
      res.send("Success!");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occured");
    });
});

// app.set('port', 5000);
const server = app.listen(port, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

exports.app = functions.https.onRequest(app);