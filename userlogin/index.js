const bodyParser = require('body-parser')
const fs = require('firebase-admin')
const express = require('express')
const app = express();
const session = require('express-session')
const axios = require('axios');


const serviceAccount = require('./serverlessassignemnt-firebase.json');
const { QuerySnapshot } = require('@google-cloud/firestore');

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(session({
    'secret': '43ji43j4n3jn4jk34n'
  }))


app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/login.html")
})

app.listen(3001, function() {
    console.log('listenign on 6000')
})

app.get('/loginsuccess', (req, res) =>{
    res.sendFile(__dirname + "/loginsuccess.html")
})

app.get('/loginerror', (req, res) =>{
    res.sendFile(__dirname + "/loginerror.html")
})

var sess;

app.post('/login', (req, res) => {
    console.log(req.body)
    const fs_db = fs.firestore();
    let user_entered_email = req.body.uname;
    let user_entered_password = req.body.psw;
    sess = req.session;
    sess.email = user_entered_email
    // sess.email = user_entered_email
    fs_db.collection("registrationdetails").doc(user_entered_email).get().then((docSnapshot) => {
            if(docSnapshot.exists) {
                if (docSnapshot.data().email === user_entered_email && docSnapshot.data().password === user_entered_password) {
                    // fs_db.collection("loginstatus").where("email", "==", user_entered_email).get().then((querySnapshot) => {
                    //     querySnapshot.forEach((doc) => {
                    //         doc.update({status: "online"})
                    //     })
                    // })
                    fs_db.collection("loginstatus").doc(user_entered_email).update({status: "online"})
                //     axios.post('http://localhost:5000/showusers', {
                // username: docSnapshot.data().fname,
                // email: docSnapshot.data().email,
                // }, {
                //     headers: {
                //       'Content-Type': 'application/x-www-form-urlencoded'
                //     }
                //   })
                let username = docSnapshot.data().fname;
                let email = docSnapshot.data().email;
                sess.username = username;
                axios.post('https://showusers-image-35qbnyed6q-uc.a.run.app/showusers', {
  username: username,
  email: email
                },)
                  .then(response => {
                        console.log(`statusCode: ${response.status}`);
                        res.render('loginsuccess',{response: response.data});
                    }).catch(error => {
                        console.error(error);
                    });
                    
                    // res.redirect('http://localhost:5000/showusers')
                }
            } else {
                res.redirect('/loginerror')
            }
    })

})

app.post('/logout', (req, res) =>{
    
    let email = sess.email;
    console.log("email session : " + email)
    const fs_db = fs.firestore();
    fs_db.collection('registrationdetails').doc(email).get().then((docSnapshot) => {
        if(docSnapshot.exists) {
            fs_db.collection('loginstatus').doc(email).update({status: "offline"})
        }
    })
    //code for making user offline.
    // res.render('logout', {username: username})
    res.render("logout", {username: sess.username})
})