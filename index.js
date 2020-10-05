const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const ObjectId = require('mongodb').ObjectId;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(urlencodedParser = bodyParser.urlencoded({ extended: false }));


// const admin = require("firebase-admin");

var serviceAccount = require("./volunteer-network-client-firebase-adminsdk-unz3a-2c723d1356");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://volunteer-network-client.firebaseio.com"
});


const port = 5000;

console.log(process.env.DB_USER)

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjf0d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerWebsite").collection("registers");

  app.post('/addVolunteer', (req, res) => {
      const newVolunteer = req.body;
      volunteerCollection.insertMany(newVolunteer)
      .then(result => {
        // res.send(result.insertedCount > 0)
        // res.send(result)
        console.log(result.insertedCount)
        res.send(result.insertedCount)

      })
  })

  app.post("/addRegisterVolunteer", (req, res) => {
    const register = req.body;
    volunteerCollection.insertOne(register)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })


  // app.post('/registerVolunteer', (req, res) => {
  //   const newRegister = req.body;
  //   volunteerCollection.insertOne(newRegister)
  //   .then(result => {
  //     res.send(result.insertedCount > 0)
  //     // res.send(result)
  //     // console.log(result.insertedCount)
  //     // res.send(result.insertedCount)
  //     console.log(result)
  //   })
  //   console.log(newRegister)
  // })

  app.get('/volunteers', (req, res) => {
    volunteerCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  })

  app.get('/allVolunteers', (req, res) => {
    volunteerCollection.find({})
    .toArray( (err, documents) => {
        res.send(documents)
    })
  })

  app.get('/volunteer/:name', (req, res) => {
    volunteerCollection.find({name: req.params.name})
    .toArray( (err, documents) => {
        res.send(documents[0])
    })
  })

  app.delete('/delete/:id', (req, res) => {
    //   console.log(req.params.id)
    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        console.log(result);
        res.send(result.deletedCount > 0);
    })
  })

  app.get('/events', (req, res) => {
    volunteerCollection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  //   const bearer = req.headers.authorization;
    
  //   if(bearer && bearer.startsWith('Bearer ')){
  //     const idToken = bearer.split(' ')[1];
  //     console.log({idToken})
  //     admin.auth().verifyIdToken(idToken)
  //     .then(function(decodedToken) {
  //       const emailId = decodedToken.email;
  //       const emailQuery = req.query.email;

  //       console.log(emailId, emailQuery);

  //       if(emailId === emailQuery){
  //         volunteerCollection.find({email: emailQuery})
  //         .toArray( (err, documents) => {
  //             res.status(200).send(documents);
  //         })
  //       }
  //       else{
  //         res.status(401).send('Un-authorized access request');
  //       }
  //     }).catch(function(error) {
  //       // Handle error
  //       res.status(401).send('Un-authorized access request');
  //     });
  //   }
  //   else{
  //     res.status(401).send('Un-authorized access request');
  //   }
  })
});


app.get('/', (req, res) => {
  res.send('Hello Welcome to mongo data base!')
})

app.listen(process.env.PORT || port)