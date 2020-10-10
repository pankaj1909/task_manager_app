const express = require('express')
const router = new express.Router()
const Task = require('../models/Task')
const auth = require('../middleware/authentication')


//Creating new task
router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(error)
    }

})

//finding a task
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) match['completed'] = req.query.completed === 'true'

    if (req.query.sortBy){
        let sortBy = req.query.sortBy.split(':')
        sort[sortBy[0]] = sortBy[1] === 'desc' ? -1 : 1
    }

    try {
        //const task = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//updating task
router.patch('/taskUpdate/:id', auth, async (req, res) => {
    const allowedUpdatesArrayTask = ['completed', 'description']
    const isValid = Object.keys(req.body).every((update) => {
        return allowedUpdatesArrayTask.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({error: 'Invalid property'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        Object.keys(req.body).forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// deleting task
router.delete('/deleteTask/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router