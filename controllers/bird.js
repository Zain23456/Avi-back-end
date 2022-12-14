import { Bird } from "../models/bird.js"
import { v2 as cloudinary } from 'cloudinary'
import { Profile } from '../models/profile.js'

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  req.body.author = req.user.profile
  Bird.create(req.body)
  .then(bird => {
    Profile.findById(req.user.profile)
    .then(profile => {
      bird.author = profile
      res.json(bird)
    }) 
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function show(req, res) {
  Bird.findById(req.params.id)
  .populate('author')
  .then(bird => {
    res.json(bird)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function index(req, res) {
  Bird.find({})
  .populate('author')
  .sort({createdAt:'desc'})
  .then(birds => {
    res.json(birds)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function deleteBird(req, res) {
  Bird.findByIdAndDelete(req.params.id)
  .then(deletedBird => {
    res.json(deletedBird)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function updateBird(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  Bird.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(updatedBird => {
    res.json(updatedBird)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function addPhoto(req, res) {
  const imageFile = req.files.photo.path
  Bird.findById(req.params.id)
  .then(bird => {
    cloudinary.uploader.upload(imageFile, {tags: `birds`})
    .then(image => {
      bird.photo = image.url
      bird.save()
      .then(bird => {
        res.status(201).json(bird.photo)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  })
}



export {
  create,
  show,
  index,
  deleteBird as delete,
  updateBird as update,
  addPhoto,
}