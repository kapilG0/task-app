const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_APIKEY)
sgMail.send({
    to:'kapilkggupta2@gmail.com',
    from:'kapilkggupta2@gmail.com',
    subject:'mail',
    text:'-'
}).then(()=>{
    console.log('Message')
}).catch((e)=>{
    console.log(e)
})
const sendwelcomeemail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'kapilkggupta2@gmail.com',
        subject:'Thanks for joining in',
        text:`welcome to the app ${name}`
    })

}
const sendcancelemail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'kapilkggupta2@gmail.com',
        subject:'thanks',
        text:`Bye ${name}. i hope you will come`
    })
}
module.exports={
    sendwelcomeemail:sendwelcomeemail,
    sendcancelemail:sendcancelemail
}