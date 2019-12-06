const Category = require("../models/category");
const Blog = require("../models/blog");
const slugify = require("slugify");
const errorHandler = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  Category.findOne({ name: req.body.name }).exec((err, cat) => {
    if (cat) {
      return res.status(400).json({
        error: "Category's name is taken"
      });
    }

    const { name } = req.body;
    const slug = slugify(name).toLowerCase();

    const category = new Category({ name, slug });
    category.save((err, data) => {
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
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(categories);
  });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;

  Category.findOne({ slug }).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    Blog.find({ categories: category })
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

        res.json({ category, blogs, size: blogs.length });
      });
  });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: "Category deleted successfully"
    });
  });
};
