const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const sg = require("@sendgrid/mail");
sg.setApiKey(process.env.SENDGRID_API_KEY);
const { OAuth2Client } = require("google-auth-library");
const _ = require("lodash");

const User = require("../models/user");
const Blog = require("../models/blog");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken"
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "1d"
      }
    );

    const emailData = {
      from: process.env.EMAIL_NOREPLY,
      to: email,
      subject: `Account activation link | ${process.env.APP_NAME}`,
      html: `
        <h4 style="color:black">
          Hello ${name}! Thanks for creating an account with us.
        </h4>
        <p style="color:black">
          Please click on the following link to activate your account:
        </p>
        <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
        <hr />
        <p style="color:#888">This email may contain sensitive information</p>
        <p style="color:#888">https://seoblog.com</p>
      `
    };

    sg.send(emailData).then(sent => {
      return res.json({
        message: `An email as been sent to ${email}. Please follow the instruction to activate your account.`
      });
    });
  });
};

exports.signup = (req, res) => {
  const token = req.body.token;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "This link is expired. Please sign up again."
        });
      }
      const { name, email, password } = jwt.decode(token);

      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      let newUser = new User({
        name,
        email,
        password,
        profile,
        username
      });
      newUser.save((err, success) => {
        if (err) {
          return res.status(400).json({
            error: "You already activated your account. Please log in."
          });
        }
        // res.json({
        //     user: success
        // });
        res.json({
          message: "You successfully activated your account."
        });
      });
    });
  } else {
    res.json({
      error: "Something went wrong. Please try again."
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "This user does not exist"
      });
    }
    //authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      });
    }
    //generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, username, name, email, role, imageUrl } = user;

    return res.json({
      token,
      user: { _id, username, name, email, role, imageUrl }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Logout successful"
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    if (user.role !== 1) {
      return res.status(400).json({
        error: "Access denied"
      });
    }
    req.profile = user;
    next();
  });
};

exports.canUpdateAndDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "Not Authorized"
      });
    }
    next();
  });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
      // console.log(response)
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            // console.log(user)
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d"
            });
            res.cookie("token", token, { expiresIn: "1d" });
            const { _id, email, name, role, username, imageUrl } = user;
            return res.json({
              token,
              user: { _id, email, name, role, username, imageUrl }
            });
          } else {
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti;
            user = new User({ name, email, profile, username, password });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err)
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              res.cookie("token", token, { expiresIn: "1d" });
              const { _id, email, name, role, username, imageUrl } = data;
              return res.json({
                token,
                user: {
                  _id,
                  email,
                  name,
                  role,
                  username,
                  imageUrl
                }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again."
        });
      }
    });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist"
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m"
    });

    // email
    const emailData = {
      from: process.env.EMAIL_NOREPLY,
      to: email,
      subject: `Password reset link | ${process.env.APP_NAME}`,
      html: `
          <p>Please use the following link to reset your password:</p>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>https://seoblog.com</p>
      `
    };
    // populating the db > user > resetPasswordLink
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ error: errorHandler(err) });
      } else {
        sg.send(emailData).then(sent => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
          });
        });
      }
    });
  });
};
exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Try again"
        });
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          console.log(resetPasswordLink);
          return res.status(401).json({
            error: "Something went wrong. Try later!!!"
          });
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err)
            });
          }
          res.json({
            message: `Your password has been changed.`
          });
        });
      });
    });
  }
};
