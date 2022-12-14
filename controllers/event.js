import { Event } from "../models/event.js"
import { Profile } from "../models/profile.js"

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  req.body.owner = req.user.profile
  Event.create(req.body)
  .then(event => {
    Profile.findById(req.user.profile)
    .then(profile => {
      event.owner= profile
      res.json(event)
    }) 
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}


function show(req, res) {
  Event.findById(req.params.id)
  .populate('owner')
  .then(event => {
    res.json(event)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function index(req, res) {
  Event.find({})
  .populate('owner')
  .sort({createdAt:'desc'})
  .then(events => {
    res.json(events)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function deleteEvent(req, res) {
  Event.findByIdAndDelete(req.params.id)
  .then(deletedEvent => {
    res.json(deletedEvent)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function updateEvent(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  Event.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(updatedEvent => {
    res.json(updatedEvent)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}


export {
  create,
  show,
  index,
  deleteEvent as delete,
  updateEvent as update
}