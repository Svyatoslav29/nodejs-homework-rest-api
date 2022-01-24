import sgMail from '@sendgrid/mail';

class SenderSendgrid {
  async send(message) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    return await sgMail.send({...message, from: process.env.SENDER_SENDGRID})
  }
}

export { SenderSendgrid }