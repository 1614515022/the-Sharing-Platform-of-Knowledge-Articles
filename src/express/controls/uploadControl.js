const fs = require('fs');
const path = require("path")
const os = require("os")

let uploadFile = async (req, res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')
    var imges = req.file
    fs.readFile(imges.path, (err, data) => {
        if (err) {
            console.log("图片上传失败")
            return;
        }
        var imgesori = imges.originalname
        var radname = Date.now() + parseInt(Math.random() * 999)
        var oriname = imgesori.lastIndexOf('.')
        var hzm = imgesori.substring(oriname, oriname.length)
        var pic = radname + hzm
         fs.writeFile(path.join(__dirname, '../public/image/' + pic), data,async(err) => {
            if (err) {
                console.log("图片写入失败！")
                res.send({
                    code: -1,
                    msg: "图片上传失败！"
                })
                return
            }
  
            const couter = os.networkInterfaces()
            for (var cm in couter) {
                var cms = couter[cm]
            }
            var picPath = "http://"+cms[1].address + ':3000' + '/public/image/' + pic
            res.send({
              data:picPath
            })
        })
    })
}

module.exports = {
    uploadFile
}