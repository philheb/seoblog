const sg = require("@sendgrid/mail");
sg.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
  const { name, email, message } = req.body;
  const emailData = {
    to: process.env.EMAIL_ADMIN,
    from: email,
    subject: `Contact form - ${process.env.APP_NAME}`,
    text: `Email received from the contact form \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h4>New message received from the contact form.</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      <hr />
    `
  };
  sg.send(emailData).then(sent => {
    return res.json({
      success: true
    });
  });
};

exports.contactBlogAuthorForm = (req, res) => {
  const { authorEmail, name, email, message } = req.body;
  const emailData = {
    to: authorEmail,
    from: email,
    subject: `You got a new message from - ${process.env.APP_NAME}`,
    text: `Email received from the contact form \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
      <h4>New message received from ${process.env.APP_NAME}.</h4>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
      <hr />
    `
  };
  sg.send(emailData).then(sent => {
    return res.json({
      success: true
    });
  });
};
