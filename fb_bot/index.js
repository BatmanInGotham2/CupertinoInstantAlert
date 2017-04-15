    'use strict' //means you have to use var/let in front of variables

    var express = require('express')
    var bodyParser = require('body-parser')
    var request = require("request")
    var firebase = require("firebase");

    var config = {
        apiKey: "AIzaSyAHlt4CJODLsL62AOFKxTgQL-eBmEHN898",
        authDomain: "hackcupertino.firebaseapp.com",
        databaseURL: "https://hackcupertino.firebaseio.com",
        projectId: "hackcupertino",
        storageBucket: "hackcupertino.appspot.com",
        messagingSenderId: "157896239962"
      };
      firebase.initializeApp(config);

    const app = express() //intialization of app

    app.set('port', (process.env.PORT|| 5000))

    //processing the data
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    //setting up routes
    app.get('/', function(req, res){
      res.send("Hi!")
    })

    var token = "EAAEDGYfeXboBAKjWRWxhmUZBzYC6cOhYL08LTkWZB5TpGYQ8ik6r7m8qInoiae8OUWfEgAEO7UFMrnu5Q4SfxZA0bbCE5M8nCZC0JOV7BG0paTj77v5Y1lPg9IdkO288KSrZBF89sTyxfPpdlkVL4dOjQlFBZBYxUy3lZC6Owyc4AZDZD"

    //facebook
    app.get('/webhook/', function(req, res){
      if(req.query['hub.verify_token'] === 'cupertino'){
        res.send(req.query['hub.challenge'])
      }
      res.send('Wrong Token')
    })


    //start server
    app.listen(app.get('port'), function(){
      console.log("port is running")
    })

    var move = false;
    var report = false;
    var question = true;
    var counter = 0;
    var totalMessage = "";
    var location = "";
    var locbool = false;
    var alternate = true;
    var type = ""
    var sender
    app.post('/webhook/', function(req, res){
      var messaging_events = req.body.entry[0].messaging
      for(var i = 0; i < messaging_events.length; i++){
        var event = messaging_events[i]
        sender = event.sender.id
        if(event.message && event.message.text){

          if(event.message.text.indexOf("1")!=-1){
            type = "message"
            report = true;
            move = true;
          }
          else if(event.message.text.indexOf("2")!=-1){
            type = "question"
            question = true;
            move = true;
          }

          if(locbool&&counter<0){
            if(event.message.text.indexOf("None")!=-1)
              locbool = false;
            else
              location = event.message.text;
              locbool = false;
          }

          if(event.message.text.indexOf("Yes")!=-1){
            counter = -10;
            locbool = true;
          }
          else if((event.message.text.indexOf("No")!=-1||alternate==false)&&counter>0){
            if(alternate)
              alternate = false;
            else
              alternate = true;

          }

          if(move==false){
            var contact = event.sender.id
            var info = "Hey there! If you want to report an incident press 1. If you have any questions press 2"
            sendText(contact, info)
          }
          else{
            if(counter > 0)
            totalMessage+=event.message.text
            if(report){
              if(counter==0){
                sendText(sender, "What is your report?")
                alternate = false
              }
              else if(counter > 0 && alternate)
                sendText(sender, "Is that all? (Yes/No)")
              else if(counter < 0){
                if(locbool){
                  sendText(sender, "Any Location? (If no, type None)")
                  if(location!="")
                    locbool = false;
                }
                else{
                  sendText(sender, "Thank you! We are on it!")
                  move = false;
                  report = false;
                  question = false;
                  counter = -1;
                  alternate = true;
                  sendData(totalMessage, ""+new Date(), location, type)
                  totalMessage = ""
                }
              }
            }
            else if(question){
              if(counter==0){
                sendText(sender, "What is your question?")
                alternate = false;
              }
              else if(counter > 0 && alternate)
                sendText(sender, "Is that all? (Yes/No)")
              else if(counter < 0){
                sendText(sender, "Thank you! We are on it!")
                move = false;
                report = false;
                question = false;
                counter = -1;
                alternate = true;
                sendData(totalMessage, ""+new Date(), location, type)
                totalMessage = ""

              }
            }
            counter++;
          }


       }

      //  var myDate = new Date()
        //if(event.message && event.message.text){ //if message and if message has text
          //var text = event.message.text
        //  sendText(sender, "Text echo: "+ text.substring(0, 100)+"timestamp"+myDate)
      //  }
    //}
      res.sendStatus(200) //everything worked
    }
  })

    function sendData(messagePass, timePass, locationPass, typePass){
      var ref = firebase.database().ref().child("incoming")
      var object = {
        message: messagePass,
        location: locationPass,
        timestamp: timePass,
        type: typePass
      }
      ref.push(object, function(err){
        console.log(err)
      })
    }

    function sendText(sender, text){
      var messageData = {text: text}
      request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
          recipient: {id: sender},
          message: messageData,
        }

      },function(error, response, body){
        if(error){
          console.log("sent error")
        }
        else if(response.body.error){
          console.log("response body error")
        }
      })
    }

      var secRef = firebase.database().ref().child("notifications")
      secRef.on("child_added", function(snapshot){
        var data = snapshot.val()
        if(data.tag != null && data.tag === "crucial"){
          sendText(sender, data.message)
        }
      })
