const express = require('express');
const columnControl = require('../controls/columnControl');

let router = express.Router();

router.get('/api/column',columnControl.getColumn);
router.post('/api/oColumn',columnControl.getoColumn);
router.post('/api/myColumn',columnControl.getMyColumn);
router.post('/api/columnUpdate',columnControl.columnUpdate);
router.post('/api/searchAll',columnControl.searchAll);
router.post('/api/createColumn',columnControl.createColumn);

module.exports = router;