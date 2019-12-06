const express = require('express')
const fs = require('fs')
const router = express.Router()


router.get('/', function (req, res) {

  const path = req.query.videoPath

  const stat = fs.statSync(path)
  const fileSize = stat.size

  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(200, head)
  fs.createReadStream(path).pipe(res)

})



module.exports = app => app.use('/video', router);
