const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    res.send("This is our new homepage");
});

router.get("/about", function (req, res) {
    res.send("Very cool tool, multi pages even work");
});

module.exports = router;