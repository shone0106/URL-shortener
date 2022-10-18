const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./shortUrl')
const dotenv = require("dotenv")
dotenv.config()

const app = express()


mongoose.connect(process.env.CONNECTIONSTRING,{
  useNewUrlParser: true, useUnifiedTopology: true
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res) => {
    const allUrls = await ShortUrl.find()
    res.render('index', {allUrls : allUrls})
})

app.post('/shortUrl', async (req, res) => {
    await ShortUrl.create({full : req.body.fullUrl})

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const url = await ShortUrl.findOne({short: req.params.shortUrl})
    if (url == null) return res.sendStatus(404)
    
    url.clicks++
    url.save()

    res.redirect(url.full)
})

app.listen(process.env.PORT || 5000);