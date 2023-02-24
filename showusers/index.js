const bodyParser = require('body-parser')
const fs = require('firebase-admin')
const express = require('express')
const app = express();
const session = require('express-session')
const util = require('util')


const serviceAccount = require('./serverlessassignemnt-firebase.json');
const { QuerySnapshot } = require('@google-cloud/firestore');

app.use(session({
    'secret': '43ji43j4n3jn4jk34n'
  }))

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    express.urlencoded({
      extended: true,
    })
  );
app.use(express.json());
var sess;

app.post('/showusers', async (req, res) => {
    // var logged_users = getLoggedUsers();
    // console.log("printing users")
    const fs_db = fs.firestore();
    var usersList = [];
    const writeResult = fs_db.collection("loginstatus").where("status", "==", "online").get();
    (await writeResult).forEach((doc) => {
        usersList.push(doc.data().name)
    })
    sess = req.session;
    sess.username = req.body.username;
    const user_email = req.body.email;
    const username = req.body.username;
    console.log("username :" + req.body.username);
    let id = new Date();
    req.session[id] = {username};
    req.session[id] = {user_email}
    console.log("user result : " + req.body.username);
    res.render('index',{usersList: usersList, username: username});
    // res.writeHead(302, {
    //     'Location': 'http://localhost:5000/hello'
    //     //add other headers here...
    //   });
    //   res.end();
    // res.redirect(`/show?id=${id}`)
})

app.post('/logout', (req, res) =>{
    let email = req.session[id].email;
    let username = req.session[id].username;
    fs_db.collection('registrationdetails').doc(email).get().then((docSnapshot) => {
        if(docSnapshot.exists) {
            fs_db.collection('loginstatus').doc(email).update({status: "offline"})
        }
    })
    //code for making user offline.
    const fs_db = fs.firestore();
    // res.render('logout', {username: username})
    res.sendFile(__dirname + "/logout.html")
})

async function getLoggedUsers() {
    const fs_db = fs.firestore();
    var usersList = [];
    const writeResult = fs_db.collection("loginstatus").where("status", "==", "online").get();
    (await writeResult).forEach((doc) => { 
        usersList.push(doc.data().name)
    })
    console.log("user result : " + usersList);
    return usersList;
}

app.listen(5000, function() {
    console.log('listenign on 5000')
})