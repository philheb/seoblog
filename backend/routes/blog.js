const express = require("express");
const router = express.Router();
const {
  createBlog,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  image,
  listRelated,
  listSearch,
  listByUser,
  listRecent
} = require("../controllers/blog");
const {
  adminMiddleware,
  authMiddleware,
  requireSignin,
  canUpdateAndDeleteBlog
} = require("../controllers/auth");

//Admin
router.post("/blog", requireSignin, adminMiddleware, createBlog);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put("/blog/:slug", requireSignin, adminMiddleware, update);

//User
router.post("/user/blog", requireSignin, authMiddleware, createBlog);

router.get("/:username/blogs", listByUser);
router.delete(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateAndDeleteBlog,
  remove
);
router.put(
  "/user/blog/:slug",
  requireSignin,
  authMiddleware,
  canUpdateAndDeleteBlog,
  update
);

//All
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags); //POST cause queries
router.get("/blog/:slug", read);
router.get("/blog/image/:slug", image);
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);
router.get("/blogs/recent", listRecent);

module.exports = router;
