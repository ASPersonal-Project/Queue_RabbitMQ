const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const QUEUE_NAME = 'emailQueue';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "anjanashakthi114@gmail.com",
      pass: "bkqczbufflgkihkk",
    },
  });




async function startWorker() {
  const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://rabbitmq');
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("[worker] waiting for email jobs...")

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg != null){
      const jobData = JSON.parse(msg.content.toString());
      console.log("[worker] received job:", jobData);

      const maxRetries = 3;
      let attempts = 0;

      async function trySendEmail() {
        try {
          await sendEmail(jobData);
          channel.ack(msg); // success, acknowledge
        } catch (err) {
          attempts++;
          console.error(`[worker] Email sending failed (attempt ${attempts}):`, err.message);

          if (attempts < maxRetries) {
            setTimeout(trySendEmail, 2000); // Retry after 2 seconds
          } else {
            console.error("[worker] Max retries reached. Discarding message.");
            channel.ack(msg); // Acknowledge anyway to remove from queue
            // Optionally: push to a dead-letter queue or log for inspection
          }
        }
      }

      trySendEmail();
    }
  })
}

async function sendEmail(data) {
  const {to, subject, text} = data;
    console.log(`Processing job to send email to ${to}`);

    await transporter.sendMail({
        from: 'anjanashakthi114@gmail.com',
        to,
        subject,
        text
    });
}

startWorker().catch(err => { 
    console.error("[worker] Error in worker:", err);
    process.exit(1);
});