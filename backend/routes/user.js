const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
  requireSignin
} = require("../controllers/auth");
const { read, publicProfile, update, image } = require("../controllers/user");

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update", requireSignin, authMiddleware, update);
router.get("/user/image/:username", image);

module.exports = router;
