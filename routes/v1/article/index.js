import { Router } from 'express'
import mongoose from 'mongoose'
import Article from '../../../models/article'
import checkAuth from '../../../plugin/check-auth'
const article = Router()

article.get('/', function (req, res, next) {
  Article.find().exec().then(docs => {
    // console.log(docs)
    const response = {
      count: docs.length,
      articles: docs.map(doc => {
        return {
          title: doc.title,
          content: doc.content,
          _id: doc._id,
          fans: doc.fans,
          request: {
            type: "GET",
            url: "http://localhost:3000/v1/article/" + doc._id
          }
        }
      })
    }
    res.status(200).json(response)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})
article.get('/:id', function (req, res, next) {
  let id = req.params.id
  // console.log(id)
  Article
    .findById(id)
    .populate('author fans')
    .exec()
    .then(result => {
      // console.log(result)
      // const response = {
      //   title: result.title,
      //   contet: result.content,
      //   fans: result.fans 
      // }
      res.status(200).json(result)
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})
article.post('/', checkAuth, function (req, res, next) {
  let author = req.body.author ? req.body.author : ''
  let title = req.body.title ? req.body.title : ''
  let content = req.body.content ? req.body.content : ''
  let fans = req.body.fans ? JSON.parse(req.body.fans) : []
  let desc = req.body.desc ? req.body.desc : ''
  let mdContent = req.body.mdContent ? req.body.mdContent : ''
  let parseContent = req.body.parseContent ? req.body.parseContent : ''
  let tags = req.body.tags ? req.body.tags : []
  let type = req.body.type ? req.body.type : ''
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    author: author,
    title: title,
    content: content,
    fans: fans,
    desc: desc,
    mdContent: mdContent,
    parseContent: parseContent,
    type: type,
    tags: tags
  })
  console.log(article)
  // res.end(200)
  article.save().then(result => {
    // console.log(result)
    res.status(201).json({
      message: 'Handling Create Article',
      createArticle: result
    })
  }).catch(err => {
    // console.log(err)
    res.status(500).json({
      error: err
    })
  })
})
article.put('/:id', function (req, res, next) {
  const id = req.params.id
  const updateObj = {
    title: req.body.title ? req.body.title : '',
    content: req.body.content ? req.body.content : '',
    fans: req.body.fans ? JSON.parse(req.body.fans) : [],
    desc: req.body.desc ? req.body.desc : '',
    mdContent: req.body.mdContent ? req.body.mdContent : '',
    parseContent: req.body.parseContent ? req.body.parseContent : '',
    tags: req.body.tags ? req.body.tags : [],
    type: req.body.type ? req.body.type : ''
  }

  for (var i in updateObj) {
    if (updateObj[i] === '' || updateObj[i].length === 0) {
      delete updateObj[i]
    }
  }
  console.log(updateObj)
  Article.update({ _id: id }, updateObj)
    .exec()
    .then(result => { console.log(result); res.status(200).json({ result: result }) })
    .catch(err => {
      // console.log(err)
      res.status(500).json({
        error: err
      })
    })
})
export default article