import { SupplyList } from '../models/supplylist.js'
import { Profile } from '../models/profile.js'

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  req.body.owner = req.user.profile
  SupplyList.create(req.body)
  .then(supplyList => {
    Profile.findById(req.user.profile)
    .then(profile => {
      supplyList.owner= profile
      res.json(supplyList)
    }) 
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}


function show(req, res) {
  SupplyList.findById(req.params.id)
  .populate('owner')
  .then(supplyList => {
    res.json(supplyList)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}


const index = async (req, res) => {
  try {
    const supplylists = await SupplyList.find({})
      .populate('owner')
      .sort({ createdAt: 'desc' })
    res.status(200).json(supplylists)
  } catch (err) {
    res.status(500).json(err)
  }
}

function deleteSupplyList(req, res) {
  SupplyList.findByIdAndDelete(req.params.id)
  .then(deletedSupplyList => {
    res.json(deletedSupplyList)
  })
  .catch(err => {
    console.log(err)
    res.json(err)
  })
}

function updateSupplyList(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  SupplyList.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(updatedSupplyList => {
    res.json(updatedSupplyList)
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
  deleteSupplyList as delete,
  updateSupplyList as update
}