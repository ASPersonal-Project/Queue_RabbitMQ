const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  if (channel) return channel;

  const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://rabbitmq');
  channel = await connection.createChannel();

  const exchange = 'notification_exchange';
  await channel.assertExchange(exchange, 'direct', { durable: true });

  return channel;
}

module.exports = connectRabbitMQ;