const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");

const fs = require("fs");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");

const { errorHandler } = require("../helpers/dbErrorHandler");
const { smartTrim } = require("../helpers/blog");
const { list } = require("./category");

exports.createBlog = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be upload"
      });
    }
    const { title, body, categories, tags } = fields;

    const arrayOfCategories = categories && categories.split(",");
    const arrayOfTags = tags && tags.split(",");

    if (!title || title.length < 3) {
      return res.status(400).json({
        error: "Title is too short"
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: "Content is too short"
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: "At least one category is required"
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: "At least one tag is required"
      });
    }
    const excerpt = smartTrim(body, 160, " ", " ...").replace(/<[^>]*>?/gm, "");

    const blog = new Blog({
      title,
      body,
      excerpt,
      slug: slugify(title).toLowerCase(),
      mtitle: `${title} | ${process.env.APP_NAME}`,
      mdesc: stripHtml(body.substring(0, 160)),
      postedBy: req.user._id
    });

    if (files.image) {
      if (files.image.size > 10000000) {
        return res.status(400).json({
          error: "The image file should be smaller than 1mb"
        });
      }
      blog.image.data = fs.readFileSync(files.image.path);
      blog.image.contentType = files.image.type;
    }

    blog.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      console.log("blog saved!!!");

      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        } else {
          Blog.findByIdAndUpdate(
            result._id,
            { $push: { tags: arrayOfTags } },
            { new: true }
          ).exec((err, result) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err)
              });
            } else {
              res.json(result);
            }
          });
        }
      });
    });
  });
};

exports.list = (req, res) => {
  Blog.find({})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          err: errorHandler(err)
        });
      }
      res.json(data);
    });
};

exports.listRecent = (req, res) => {
  Blog.find({})
    .sort("-updatedAt")
    .limit(3)
    .populate("postedBy", "_id name username profile")
    .select("_id title slug excerpt postedBy createdAt updatedAt")
    .exec((err, data) => {
      if (err) {
        return res.json({
          err: errorHandler(err)
        });
      }
      res.json(data);
    });
};

exports.listAllBlogsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;
  let tags;

  Blog.find({})
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
      blogs = data; // blogs
      // get all categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err)
          });
        }
        categories = c; // categories
        // get all tags
        Tag.find({}).exec((err, t) => {
          if (err) {
            return res.json({
              error: errorHandler(err)
            });
          }
          tags = t;
          // return all blogs categories tags
          res.json({ blogs, categories, tags, size: blogs.length });
        });
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    // .select("-image")
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .select(
      "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
    )
    .exec((err, data) => {
      if (err) {
        return res.json({
          err: errorHandler(err)
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) {
      return res.json({
        err: errorHandler(err)
      });
    }
    res.json({
      message: "Blog deleted successfully"
    });
  });
};

exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Image could not be upload"
        });
      }

      let slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { body, categories, tags } = fields;

      if (body) {
        oldBlog.excerpt = smartTrim(body, 160, " ", " ...").replace(
          /<[^>]*>?/gm,
          ""
        );

        oldBlog.mdesc = stripHtml(body.substring(0, 160));
      }
      if (categories) {
        oldBlog.categories = categories.split(",");
      }
      if (tags) {
        oldBlog.tags = tags.split(",");
      }

      if (files.image) {
        if (files.image.size > 10000000) {
          return res.status(400).json({
            error: "The image file should be smaller than 1mb"
          });
        }
        oldBlog.image.data = fs.readFileSync(files.image.path);
        oldBlog.image.contentType = files.image.type;
      }

      oldBlog.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        console.log("blog saved!!!");
        // result.image = undefined
        res.json(result);
      });
    });
  });
};

exports.image = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .select("image")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.set("Content-Type", blog.image.contentType);
      res.send(blog.image.data);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;
  console.log("the body: ", req.body);

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate("postedBy", "_id name username profile")
    .select("title slug excerpt postedBy createdAt updatedAt")
    .exec((err, blogs) => {
      if (err || !blogs) {
        return res.status(400).json({
          error: "Blogs not found"
        });
      }
      res.json(blogs);
    });
};

exports.listSearch = (req, res) => {
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { body: { $regex: search, $options: "i" } }
        ]
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          });
        }
        res.json(blogs);
      }
    )
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .select(
        "_id title slug excerpt categories tags postedBy createdAt updatedAt"
      );
  }
};

exports.listByUser = (req, res) => {
  User.findOne({ username: req.params.username }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    Blog.find({ postedBy: user._id })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select("_id title slug excerpt createdAt updatedAt")
      .exec((err, data) => {
        if (err) {
          return res.json({
            err: errorHandler(err)
          });
        }
        res.json(data);
      });
  });
};
