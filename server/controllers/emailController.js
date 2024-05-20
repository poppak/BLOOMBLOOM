const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'yandex',
    auth: {
        user: 'eedawewoh@yandex.ru',
        pass: 'katidyutxqptxhbd'
    }
});

transporter.on('login', (auth) => {
    console.log('Успешный вход в аккаунт Yandex');
});

transporter.on('error', (err) => {
    console.error('Ошибка входа в аккаунт Yandex:', err);
});

const sendEmailNotification = (req, res) => {
    const { subject, name, orderDetails } = req.body;
    const mailOptions = {
        from: 'eedawewoh@yandex.ru',
        to: 'lkim3217@gmail.com',
        subject: subject,
        html: `Добрый день, ${name}! ${orderDetails}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Ошибка при отправке уведомления на почту');
        } else {
            console.log('Email уведомление отправлено: ' + info.response);
            res.status(200).send('Email уведомление успешно отправлено');
        }
    });
};

module.exports = { sendEmailNotification };