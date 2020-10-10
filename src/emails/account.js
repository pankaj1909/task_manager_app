const sgMail = require('@sendgrid/mail')

let key = process.env.SENDGRID_API_KEY
sgMail.setApiKey(key)

sgMail.send({
    to: 'aaa@gmail.com',
    from: 'aaa@gmail.com',
    subject: 'my first line',
    text: 'good boy'
}).then(() => {
    console.log("success")
}).catch((eror) => {
    console.log(eror)
})