const express = require('express');
const articleControl = require('../controls/articleControl')
let router = express.Router();

router.post('/api/article',articleControl.getArticle)
router.post('/api/oArticle',articleControl.getoArticle)
router.post('/api/createArticle',articleControl.createArticle)
router.post('/api/agreeListIpt',articleControl.agreeListIpt)
router.post('/api/getAgreeList',articleControl.getAgreeList)
router.post('/api/getCollectList',articleControl.getCollectList)
router.post('/api/collectListIpt',articleControl.collectListIpt)
router.get('/api/myCollectList',articleControl.myCollectList)
router.post('/api/deleteArticle',articleControl.deleteArticle)
router.post('/api/editArticle',articleControl.editArticle)
router.post('/api/articleArt',articleControl.articleArt)

module.exports = router;

