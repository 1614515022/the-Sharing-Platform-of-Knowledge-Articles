const express = require('express');
const userControl = require('../controls/usercontrol'); 
const uploadControl = require('../controls/uploadcontrol'); 
const multer = require('multer');
let router = express.Router();
const upload = multer({
  dest: 'src/express/public/image',
})
router.post('/api/user/login',userControl.userLogin)
router.post('/api/users',userControl.userCreate)
router.post('/api/getUser',userControl.getUser)
router.post('/api/userUpdate',userControl.userUpdate)
router.post('/api/upload',upload.single("file"),uploadControl.uploadFile)
module.exports = router;