// const amqp = require('amqplib');
// const User = require('./user');

// const QUEUE_NAME = 'emailQueue';

// async function publishEmailJob() {
//     const users = await User.find()
//     console.log(users);

//     const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://rabbitmq');
//     const channel = await connection.createChannel()

//     await channel.assertQueue(QUEUE_NAME, { durable: true });

//     users.map(user => {
//         const emailData = {
//             to: user.email,
//             subject: 'Welcome to Our Service',
//             text: `Hello ${user.name}, welcome to our service!`
//         };
//         channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailData)), {
//             persistent: true
//         });
//         console.log('[Publisher] Email job sent:', emailData);
//     });

//     await channel.close();
//     await connection.close();
// }

const connectRabbitMQ = require('./rabbitmq');

async function publishJobs(notificationType, data) {
  const channel = await connectRabbitMQ();
  const exchange = 'notification_exchange';

//   const emailJob = {
//     to: 'user@example.com',
//     subject: 'Welcome!',
//     text: 'Hello, welcome to our service.'
//   };

//   const smsJob = {
//     phone: '+1234567890',
//     message: 'Your OTP is 123456'
//   };

  if(notificationType == 'email'){
    channel.publish(exchange, 'email', Buffer.from(JSON.stringify(data)));
  console.log('[Publisher] Sent email job.');
  }

  if(notificationType == 'sms'){
    channel.publish(exchange, 'sms', Buffer.from(JSON.stringify(data)));
  console.log('[Publisher] Sent SMS job.');
  }

  
  
}


module.exports = publishJobs;