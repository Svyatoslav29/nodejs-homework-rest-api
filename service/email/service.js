import Mailgen from 'mailgen';

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://localhost:4000'
        break
      case 'test':
        this.link = 'http://localhost:4000'
        break
      case 'production': 
        this.link = 'http://heroku'
        break
      default:
        this.link = 'http://localhost:4000'
    }
  }

  createEmailTemplate(userName, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Test',
        link: this.link
      }
    });

    const email = {
      body: {
        name: userName,
        intro: 'Welcome! We are happy you joined us, lets have some fun',
        action: {
          instructions: 'To get started with Mailgen, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
      }
    };

    return mailGenerator.generate(email)
  }

  async sendVerifyEmail(email, userName, verifyToken) {
    const emailBody = this.createEmailTemplate(userName, verifyToken);
    const message = {
      to: email,
      subject: 'Verify email',
      html: emailBody
    }
    try {
      const result = await this.sender.send(message)
      console.log(result)
      return true
    } catch (error) {
      console.log.error(error.message)
      return false
    }
  }
}

export default EmailService