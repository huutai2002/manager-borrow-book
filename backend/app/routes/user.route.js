const express = require("express");
const user = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verify.token");
const isAdmin = require("../middlewares/authorization");

const router = express.Router();

router.route("/register").post(user.create);

router.route("/getall").get(verifyToken, isAdmin, user.findAll);

//router.route("/:id").put(user.update);

router.route("/info").post(user.getInfo);

router.route("/login").post(user.login);

router.route("/info/:id").patch(verifyToken, user.update);

module.exports = router;
