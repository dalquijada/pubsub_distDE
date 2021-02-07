const express = require("express");
const router = express();
const usersController = require("../controllers/users-controller");

router.post("/register", usersController.registerUsers);
router.post("/login", usersController.loginUsers);

module.exports = router;
