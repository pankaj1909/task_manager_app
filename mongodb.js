const {MongoClient, ObjectID} = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

/*const id = new ObjectID()
console.log(id)*/

MongoClient.connect(connectionUrl, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to db' + error)
    }

    const db = client.db(databaseName)

    //INSERTING DATA INTO DB
    /*db.collection('users').insertOne({
        name: 'Pankaj',
        age: 24
    }, (error, result) => {
        if (error) {
            return console.log("unable to insert user")
        }

        console.log(result.ops)
    })

    db.collection('users').insertMany([{
        name: 'Ram',
        age: 24
    }, {
        name: 'Ravi',
        age: 25
    }
    ], (error, result) => {
        if (error) {
            return console.log("unable to insert user")
        }

        console.log(result.ops)
    })

    db.collection('tasks').insertMany([
        {descriptions: 'Maid bill', completed: true},
        {descriptions: 'wifi bill', completed: true},
        {descriptions: 'Electricty bill', completed: false},
    ], (error, result)=>{
        if(error){
            return console.log('Unable to Insert data')
        }

        console.log(result.ops)
    })*/


    //Fetching data

    /*db.collection('users').findOne({_id: new ObjectID('5f57b7250a4cce23f4115eba')}, (error, user) =>{
        if(error){
            return console.log('unable to fetch data')
        }

        console.log(user)
    })

    db.collection('users').find({age: 24}).toArray((error, users) =>{
        console.log(users)
    })

    db.collection('tasks').findOne({_id: new ObjectID('5f57bbacc1b302174cc93899')}, (error, task) =>{
        if(error){
            return console.log('unable to fetch data')
        }

        console.log(task)
    })

    db.collection('tasks').find({completed: false}).toArray((error, task) =>{
        console.log(task)
    })*/

    //Updating items

    /*db.collection('users').updateOne({
        _id: new ObjectID("5f57b8f8530f752edc690bfc")
    }, {
        $set: {
            name: 'Mikel'
        },
        $inc:{
            age: 1
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })*/

    /*db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })*/

    //Delete

    /*db.collection("users").deleteMany({
        age:25
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })*/

    /*db.collection("tasks").deleteOne({
        descriptions: "wifi bill"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })*/


})
