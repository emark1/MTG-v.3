const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const models = require('./models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

//We need cors so the browser will allow us to interact between sites, otherwise it will flag as a security risk
app.use(cors())
//Body parser to read the body of received json
app.use(bodyParser.json())

//******************************************************
//****************ADD CARD TO COLLECTION****************
//******************************************************

app.post('/add-card',(req,res) => {
  let name = req.body.card.name
  let cmc = req.body.card.cmc
  let rarity = req.body.card.rarity
  let artist = req.body.card.artist
  let cardid = req.body.card.id
  let power = req.body.card.power
  let imageuripng = req.body.card.image_uris.png
  let price = req.body.card.prices.usd
  let colors = req.body.card.colors.toString()
  let userId; 
  let coloridentity = req.body.card.color_identity.toString()

  jwt.verify(req.body.token, 'pinkflamingo', function(err, decodedToken) {
    if(err) { 
      console.log("Error verifying token")
      res.json({success: false, message: "Error verifying token"}) 
    }
    else {
     console.log("Setting userID!") 
     userId = decodedToken.userID;   // Add to req object
    }
  });

  //create variable that holds an object, in format of Card class
  let card = models.Card.build({
      userId: userId,
      name: name,
      cmc: cmc,
      rarity: rarity,
      artist: artist,
      cardid: cardid,
      power: power,
      imageuripng: imageuripng,
      price: price,
      color: colors,
      coloridentity: coloridentity
    })
  //save the new variable to the Cards table
  card.save().then((savedCard) => {
    console.log(savedCard)
  })
  .then(() => {
    //success message
    console.log("Card saved!")
  }).catch(error => console.log(error))
})

//************************************************************
//****************RETRIEVE CARDS FROM DATABASE****************
//************************************************************

app.post('/api/cards', (req,res) => {
  let userId;

  jwt.verify(req.body.token, 'pinkflamingo', function(err, decodedToken) {
    if(err) { 
      console.log("Error verifying token")
      res.json({success: false, message: "Error verifying token"}) 
    }
    else {
     console.log("Setting userID!") 
     userId = decodedToken.userID;   // Add to req object
    }
  });

  console.log("Retrive Cards: USERID IS: " + userId)

  models.Card.findAll({
  where: {
    userId: userId,
  }
  }).then((cards) => res.json(cards))

})

//***********************************************************
//****************DELETE A CARD FROM DATABASE****************
//***********************************************************

app.post('/api/cards/delete',(req,res) => {
  let id = req.body.idcard
  console.log(id)
  models.Card.destroy({
    where: {
      id: id
    }
  }).then(() => {
    res.json({success: true, message: "CARD ELIMINATED"})
  })
})

//****************************************************
//****************FIND PRICE SUMMARIES****************
//****************************************************

app.get('/api/cards/price',(req,res) => {
models.Card.sum('price').then(sum => { 
  console.log(sum)
  res.json(sum)
  })
})

//****************************************************
//*******************REGISTER USER********************
//****************************************************

app.post('/register-user',(req,res) => {
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password

  models.User.findOne({
    where: {
      username: username,
    }
  }).then(function(user) {
    if(user) {
      res.status(409).json({message: 'User already exists'})
    } else {
      bcrypt.hash(password, 10, function(err, hash) {
        let user = {
          username : username,
          email : email,
          password : hash
        }
        models.User.create(user).then(user => {
          res.status(200).json({message: 'User registered succesfully'})
        })
      })
    }
  })
})

//******************************************************
//****************LOGIN & AUTHENTICATION****************
//******************************************************

app.post('/login',(req, res) => {
    let username = req.body.username
    let password = req.body.password

    models.User.findOne({
      where: {
        username: username,
      }
    }).then(function(user) {
    if (user == null) {
      res.status(409).json({message: 'User does not exist'})
    }
    else {
      bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
              jwt.sign({ username: username, userID: user.id }, 'pinkflamingo', function(err, token) {
                if(token) {
                res.json({token: token})
                } else {
                res.status(500).json({message: 'Can\t do that token bud'})
                }
            });            
          } else {
            res.status(404).json({message: 'Incorrect username or password'})
          }
        })
      }
    })
})

function authentication(req,res,next) {
  let headers = req.headers["authorization"]
  let token = headers.split(' ')[1]

  jwt.verify(token,'pinkflamingo',(err,decoded) => {
    if(decoded) {
      if(decoded) {
      next()
    } else {
      res.status(401).json({messages: 'Bad token bud'})
    }
  } else {
    res.status(401).json({messages: 'Bad token bud'})
  }
  })
}

app.listen(8080,() => {
  console.log('Server sure is humming!')
})

// const PORT = process.env.PORT

// app.listen(PORT,() => {
// console.log('Server sure is humming!')
// })