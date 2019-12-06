const Tag = require("../models/tag");
const Blog = require("../models/blog");
const slugify = require("slugify");
const errorHandler = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  Tag.findOne({ name: req.body.name }).exec((err, data) => {
    if (data) {
      return res.status(400).json({
        error: "Tag's name is taken"
      });
    }

    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const tag = new Tag({ name, slug });
    tag.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(data);
    });
  });
};

exports.list = (req, res) => {
  Tag.find({}).exec((err, tags) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(tags);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;

  Tag.findOne({ slug }).exec((err, tag) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    Blog.find({ tags: tag })
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

        res.json({ tag, blogs, size: blogs.length });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Tag.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: "Tag deleted successfully"
    });
  });
};
