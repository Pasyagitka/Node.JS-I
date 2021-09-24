const nodemailer = require('nodemailer');
const testEmailAccount = require('./Credentials');

const receiverEmail = "lizavetazinovich@gmail.com";


module.exports = function Send(message)
{
    let transporter = nodemailer.createTransport({
        service: "Yandex",
        auth: {
            user: testEmailAccount.user,
            pass: testEmailAccount.pass
        },
    })

    transporter.sendMail({
        from: 'pasyagitka@yandex.by',
        to: receiverEmail,
        subject: 'm0603',
        html: '<h1>' + message + '</h1>',
    },  function(error, info) {
        error ? console.log(error) : console.log('Success: ' + info.response);
    });
};