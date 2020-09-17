// server.js

require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

app.post("/reset-password", (req, res) => {
  const { email } = req.body;
  const msg = {
    to: email,
    from: 'noreply@vezeti.com',
    subject: 'Reset your password',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
      <p>We recently received a request to reset the password for your account.
Simply click the button below to reset your password.</p>
      <button>Reset Password</button>
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

app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});