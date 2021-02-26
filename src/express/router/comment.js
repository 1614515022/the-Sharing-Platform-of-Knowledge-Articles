const express = require('express');
const commentControl = require('../controls/commentControl');

let router = express.Router();

router.post('/api/getComment',commentControl.getComment)
router.post('/api/commentPublish',commentControl.commentPublish)
router.post('/api/responsePublish',commentControl.responsePublish)
router.post('/api/updateComment',commentControl.updateComment)

module.exports = router;