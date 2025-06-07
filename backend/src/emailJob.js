const emailQueue = require('./emailQueue');
const User = require('./user');

async function sendEmailJob() {
    const users = await User.find()
    console.log(users);

    users.map(user => {
        const emailData = {
            to: user.email,
            subject: 'Welcome to Our Service',
            text: `Hello ${user.name}, welcome to our service!`
        };
        emailQueue.add('email-queue', emailData, {
            attempts: 3, // Retry up to 3 times if the job fails
            backoff: {
                type: 'exponential',
                delay: 1000 // Initial delay of 1 second
            }
        });
    });
}

module.exports = sendEmailJob;