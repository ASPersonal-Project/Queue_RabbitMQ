const connectRabbitMQ = require('./rabbitmq');

async function startSMSWorker() {
  const channel = await connectRabbitMQ();
  const exchange = 'notification_exchange';
  const queue = 'SMS_QUEUE';

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, 'sms');

  console.log('[SMSWorker] Waiting for SMS jobs...');

  channel.consume(queue, async (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log('[SMSWorker] Received job:', data.name);

      // Simulate SMS sending
      await fakeSMSSender(data);

      channel.ack(msg);
    }
  });
}

async function fakeSMSSender(data) {
  console.log(`[SMSWorker] Sending SMS to ${data.phone}: "${data.text}"`);
  await new Promise(resolve => setTimeout(resolve, 500));
}

startSMSWorker().catch(err => {
  console.error("[SMSWorker] Error in worker:", err);
  process.exit(1);
});