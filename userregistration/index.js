const bodyParser = require('body-parser')
const fs = require('firebase-admin')
const express = require('express')
const app = express();

const serviceAccount = require('./serverlessassignemnt-firebase.json');

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html")
})

app.get('/registrationsuccess', (req, res) =>{
    res.sendFile(__dirname + "/registrationsuccess.html")
})

app.post('/register', async (req, res) => {
    console.log(req.body);
    const fs_db = fs.firestore();
    const assignment2_db = fs_db.collection('registrationdetails')
    const data = assignment2_db.doc(req.body.email);
    data.set({
        fname: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location,
    });
    const status_db = fs_db.collection('loginstatus')
    const data1 = status_db.doc(req.body.email);
    data1.set({
        name: req.body.firstname,
        email: req.body.email,
        timestamp: Date.now(),
        status: false,
    }).then(res.redirect('/registrationsuccess'));
})

app.listen(3000, function() {
    console.log('listenign on 3000')
})