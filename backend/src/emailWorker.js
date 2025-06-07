const {Worker} = require('bullmq');
const {Redis} = require('ioredis');
const nodemailer = require('nodemailer');
const emailQueue = require('./emailQueue');

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "anjanashakthi114@gmail.com",
      pass: "bkqczbufflgkihkk",
    },
  });

const worker = new Worker('email-queue', async job => {
    const {to, subject, text} = job.data;
    console.log(`Processing job ${job.id} to send email to ${to}`);

    await transporter.sendMail({
        from: 'anjanashakthi114@gmail.com',
        to,
        subject,
        text
    });

    console.log(`Email sent to ${to} `);
}, {connection})

worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});
