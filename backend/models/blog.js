const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {},
      min: 200,
      max: 10000,
      required: true
    },
    excerpt: {
      type: String,
      max: 1000
    },
    mtitle: {
      type: String
    },
    mdesc: {
      type: String
    },
    image: {
      data: Buffer,
      contentType: String
    },
    categories: [{ type: ObjectId, ref: "Category", required: true }],
    tags: [{ type: ObjectId, ref: "Tag", required: true }],
    postedBy: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
