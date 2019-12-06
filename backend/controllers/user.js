const fs = require("fs");
const _ = require("lodash");
const formidable = require("formidable");
const User = require("../models/user");
const Blog = require("../models/blog");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.profile.image = undefined;
  //What about req.profile.salt ??
  return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
  let username = req.params.username;
  let user;
  let blogs;

  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  User.findOne({ username }).exec((err, userData) => {
    if (err) {
      res.status(400).json({
        error: "User not found"
      });
    }
    user = userData;
    user.image = undefined;
    user.hashed_password = undefined;
    let userId = user._id;
    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      )
      .exec((err, data) => {
        if (err) {
          return res.json({
            error: errorHandler(err)
          });
        }
        blogs = data;

        res.json({ blogs, user, size: blogs.length });
      });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    let user = req.profile;
    user = _.extend(user, fields);

    if (fields.password && fields.password.length < 6) {
      return res.status(400).json({
        error: "Password should be minimum 6 characters"
      });
    }

    if (files.image) {
      if (files.image.size > 10000000) {
        return res.status(400).json({
          error: "The image file should be smaller than 1mb"
        });
      }
      user.image.data = fs.readFileSync(files.image.path);
      user.image.contentType = files.image.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      user.image = undefined;
      res.json(user);
    });
  });
};

exports.image = (req, res) => {
  const username = req.params.username;
  User.findOne({ username }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    if (user.image.data) {
      res.set("Content-Type", user.image.contentType);
      return res.send(user.image.data);
    }
  });
};
