const express = require("express");
const router = express.Router();
const { getRefreshToken } = require("../controllers/refreshTokenController");

router.get("/", getRefreshToken);

module.exports = router;
