const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

const app = express ();

app.use(bodyParser.json());
app.use(cors())

//database for testing users
const database = {
    users: [
        {
            id: '123',
            name: 'Jhon',
            email: 'jhon@gmail.com',
            password: 'coockies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'apples',
            entries: 0,
            joined: new Date()
        }
    ]
}

//database requesting and response
app.get('/', (req, res)=> {
    res.send(database.users);
})

//app sign in coding
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error Logging in');
        }
})

//app register coding
app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

//app getting profile information coding
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})
//app increment photos count coding
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found')
    }
})


app.listen(3000, ()=> {
    console.log('app is puuurrrrring at port 3000');
})