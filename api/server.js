const express = require('express')
const Users = require('./users/model')

const server = express()
server.use(express.json())

server.post('/api/users', async (req, res) => {
    try {
      // 1- gather info from client
      const { name, bio } = req.body
      // 2- assume stuff is bad, handle
      if (!name || !bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user' })
      } else {
        // 3- hit the db and send the stuff
        const user = await Users.insert({ name, bio })
        res.status(201).json(user)
      }
    } catch (error) {
      res.status(500).json({ message: `Argh!!! ${error.message}` })
    }
  })

server.get('/api/users', async (req, res) => {
    try {
      const users = await Users.find()
      res.status(200).json(users)
    } catch (error) {
      console.log(error.message) // log statement!!
      res.status(500).json({ message: "The users information could not be retrieved" })
    }
  })

server.get('/api/users/:id', async (req, res) => {
    try {
      // pull that third segment of the path
      // because that is the id we need
      const { id } = req.params
      const user = await Users.findById(id)
      if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist"})
      } else {
        res.status(200).json(user)
      }
    } catch (error) {
      res.status(500).json({ message: "The user information could not be retrieved"})
    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    Users.remove(id)
      .then(deletedUser => {
        if (!deletedUser) {
          res.status(404).json({ message: 'The user with the specified ID does not exist'})
        } else {
          res.status(200).json(deletedUser)
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'The user could not be removed'})
      })
  })

server.put('/api/users/:id', async (req, res) => {
    try {
      // 1- gather info from client
      const { id } = req.params
      const { name, bio } = req.body
      // 2- assume stuff is bad, handle
      if (!name || !bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user' })
      } else {
        // 3- hit the db and send the stuff
        const updatedUsers = await Users.update(id, { name, bio })
        if(!updatedUsers){
          res.status(404).json({message: 'The user with the specified ID does not exist'})
        }else{
          res.status(200).json(updatedUsers)
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'The user information could not be modified'})
    }
  })

  module.exports = server