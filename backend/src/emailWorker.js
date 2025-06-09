const connectRabbitMQ = require('./rabbitmq');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "anjanashakthi114@gmail.com",
      pass: "bkqczbufflgkihkk",
    },
  });




async function startEmailWorker() {
  const channel = await connectRabbitMQ();
  const exchange = 'notification_exchange';
  const queue = 'EMAIL_QUEUE';

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, 'email');

  console.log('[EmailWorker] Waiting for email jobs...');

  channel.consume(queue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log('[EmailWorker] Received job:', data.name);

      // Simulate email sending
      await sendEmail(data);

      channel.ack(msg);
    }
  });
}
async function sendEmail(data) {
  const {email, text} = data;
    console.log(`Processing job to send email to ${email}`);

    await transporter.sendMail({
        from: 'anjanashakthi114@gmail.com',
        to: email,
        subject: 'Welcome to Our Service',
        text
    });
}

startEmailWorker().catch(err => { 
    console.error("[worker] Error in worker:", err);
    process.exit(1);
});