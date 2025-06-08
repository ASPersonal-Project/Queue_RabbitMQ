const amqp = require('amqplib');
const User = require('./user');

const QUEUE_NAME = 'emailQueue';

async function publishEmailJob() {
    const users = await User.find()
    console.log(users);

    const connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://rabbitmq');
    const channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    users.map(user => {
        const emailData = {
            to: user.email,
            subject: 'Welcome to Our Service',
            text: `Hello ${user.name}, welcome to our service!`
        };
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(emailData)), {
            persistent: true
        });
        console.log('[Publisher] Email job sent:', emailData);
    });

    await channel.close();
    await connection.close();
}

module.exports = publishEmailJob;