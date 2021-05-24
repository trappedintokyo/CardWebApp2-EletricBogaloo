const Deck = require("./cards.js");
const Player = require("./playerObject.js");
var express = require("express");
var router = express.Router();
 // settings variables
const defaultName = "Virtual Cards";
const classicDeck = 52;
const jokerDeck = 54;

let playerCount = 0;
let playerSetNum = 1; // set this to the player num when game is created
let playerList = []; // Player object array
let numActive = 0;
let handNum = 0;
let openIndex = 0;
let infinite = false;
let joker = false;
let gameName = "Virtual Cards";
let deckSize = classicDeck;
let gameActive = false;

let myDeck = new Deck(joker);
let chat = []; // string array


app.get("/createclick", function(request, response) {
    response.sendFile(path.join(__dirname,'index.html'));
});

router.get("/",function(req,res) {
    res.sendFile(__dirname + "/public/views/index.html");
});
router.get("/start",function(req,res) { // loads saved data into the page
    res.json({gamename:gameName,handnum:handNum,playernum:playerSetNum,infinite:infinite,
            shuffleon:myDeck.shuffleOnReplace, joker:joker});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/player",function(req,res) {
    if(!gameActive){
        res.end(" 404 Game Not Found");
    }
    else if(openIndex >= playerSetNum){
        res.end("Error! Player Count Exceeded");
    }
    else{
        res.sendFile(__dirname + "/public/views/player.html");
    }
    //console.log(playerSetNum + " " + openIndex);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/player2",function(req,res) { // called when player doc loads
      if(openIndex >= playerSetNum){
        res.write('Error! Player Count Exceeded');
        res.end();
        return;
      }
      playerList[openIndex].setActive(true);
      //console.log(playerList[openIndex].hand);
      res.json({id:playerList[openIndex].id,realid:playerList[openIndex].realId,gamename:gameName,hand:playerList[openIndex].hand});
      openIndex++;
      //console.log(openIndex);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/indexCheck",function(req,res) {
    if(gameActive){
        let numTrue = 0;
        for(let player in playerList){
            if(playerList[player].active){
                numTrue++;
            }
        }
        //console.log(numTrue);
        //console.log(playerList);
        numActive = parseInt(numTrue);
    }
    //////////////////////////////////////////////////
    if(req.query.joker == "true"){
      deckSize = jokerDeck;
    }
    else{
      deckSize = classicDeck;
    }
    //console.log(deckSize);
    let maxHand = 1;
    maxHand = parseInt(deckSize/req.query.playernum);
    res.json({active:numActive,maxhand:maxHand, gameactive:gameActive, discard:myDeck.discard,
              empty:myDeck.CheckEmpty()});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/checkplayer", function(req,res){
    if(!gameActive){
      return;
    }
    let active = parseInt(req.query.active);
    let id = parseInt(req.query.id);
    if(active == 0){
        playerList[id].setActive(false); // player inactive
        //numActive--;
        //playerList[req.query.id].name = "empty";
        if(id < openIndex){openIndex = id;}
        // ///////////////// CODE THAT REMOVES PLAYER'S CARDS WHEN THEY LEAVE - UNTESTED
        // myDeck.ReturnHand(playerList[req.query.id].hand);
        // playerList[req.query.id].hand.length = 0;
        // /////////////////
    }
    else if(active == 1){
        //playerList[id].setActive(true); // player is active
        let otherPlayers = [];
        otherPlayers.length = 0;
        for(let x in playerList){
            if(x != id){
                otherPlayers[otherPlayers.length] = playerList[x];
            }
        }
        playerList[id].name = req.query.playername;
        res.json({gamename:gameName,chat:chat,empty:myDeck.CheckEmpty(),gameactive:gameActive,
                others:otherPlayers,tablehand:playerList[id].tableHand,hand:playerList[id].hand,infinite:infinite,
                discard:myDeck.discard});
    }
    //console.log(req.query.id + " " + playerList[req.query.id].active);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/end", function(req,res){
    if(gameActive == false){
      res.json({error:2});
      return;
    }
    myDeck = new Deck(joker);
    gameActive = false;
    numActive = 0;
    chat.length = 0;
    openIndex = 0;
    numActive = 0;
    //console.log(playerList);
    //playerList.length = 0;
    for(let player in playerList){
        playerList[player].defaultState(player);
    }
    res.json({error:5});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/drawcard",function(req,res) {
    if(myDeck.CheckEmpty()){
        res.json(null);
        return;
    }
    let cards = [];
    for(let x = 0; x < req.query.num;x++){
        cards[cards.length] = myDeck.Draw(); //calling a method in the cards.js class
    }
    for(let card in cards){
        if(cards[card] == null){
            cards.splice(card, 1); // removing null cards
        }
        let myHand = playerList[req.query.id];
        myHand.hand[myHand.hand.length] = cards[card];
    }
    res.json({cards:playerList[req.query.id].hand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/drawdiscard",function(req,res) {
    if(myDeck.discard.length == 0){
        res.json(null);
        return;
    }
    let cards = [];
    for(let x = 0; x < req.query.num;x++){
        cards[cards.length] = myDeck.DrawDiscard();
    }
    for(let card in cards){
        if(cards[card] == null){
            cards.splice(card, 1); // removing null cards
        }
        let myHand = playerList[req.query.id];
        myHand.hand[myHand.hand.length] = cards[card];
    }
    res.json({cards:playerList[req.query.id].hand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/create",function(req,res) {
    if(req.body.playernum * req.body.handnum > deckSize){
        res.json({error:1});
        return;
    }
    if(validString(req.body.name) == false){
        res.json({error:4});
        return;
    }
    if(gameActive == true){
      res.json({error:6});
      return;
    }
    //////////////////////////////////////
    if(req.body.joker == "true"){
        joker = true;
        deckSize = jokerDeck;
    }
    else{
        joker = false;
        deckSize = classicDeck;
    }
    myDeck = new Deck(joker);
    myDeck.shuffle();
    if(req.body.infinite == "true")
        infinite = true;
    else
        infinite = false;

    if(req.body.shuffleon == "true")
        myDeck.shuffleOnReplace = true;
    else
        myDeck.shuffleOnReplace = false;
    openIndex = 0;
    gameActive = true;
    numActive = 0;
    playerSetNum = req.body.playernum;
    playerList.length = playerSetNum;
    handNum = req.body.handnum;
    for(let i = 0; i< playerSetNum; i++){
        let hand = []; hand.length = 0;
        playerList[i] = new Player(i);
        playerList[i].name = "empty";
        if(handNum !=0){
            for(let x = 0; x < handNum ;x++){
                hand[x] = myDeck.Draw(); //calling a method in the cards.js class
            }
            for(let card in hand){
                if(hand[card] == null){
                    hand.splice(card, 1); // removing null cards
                }
            }
            playerList[i].hand = hand;
        }
        else{
            playerList[i].hand = hand;
        }
    }
    //clears chat
    chat.length = 0;
    if(/^[ ]*[ ]*$/.test(req.body.name) == true){
        gameName = defaultName;
    }
    else{
        gameName = req.body.name;
    }
    res.json({error:0});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/update",function(req,res) {
    if(!gameActive){
        res.json({error:2});
        return;
    }
    if(validString(req.body.name) == false){
        res.json({error:4});
        return;
    }
    //////////////////////////////////////
    if(/^[ ]*[ ]*$/.test(req.body.name) == true){
        gameName = defaultName;
    }
    else{
        gameName = req.body.name;
    }
    res.json({error:3});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/chat",function(req,res) {
    chat[chat.length] = req.body.line;
    res.json({chat:chat});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/discardtomain",function(req,res) {
    myDeck.DiscardToMain();
    res.json(null);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/shuffle",function(req,res) {
    myDeck.shuffle();
    res.json(null);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/totable",function(req,res) {
    if(!req.body.card)
        return
    let id = parseInt(req.body.id);
    let card = req.body.card;
    let index = myDeck.FindIndex(card,playerList[id].hand);
    if(index != -1){
        playerList[id].hand.splice(index, 1);
        playerList[id].tableHand[playerList[id].tableHand.length] = card;
        // if the table hand exceeds 3 cards - discard the first one
        if(playerList[id].tableHand.length > 3){
            myDeck.Discard(playerList[id].tableHand[0]);
            playerList[id].tableHand.splice(0, 1);
        }
        for(let card in playerList[id].hand){
            if(playerList[id].hand[card] == null){
                myHand.splice(card, 1);
            }
        }
    }
    res.json({hand:playerList[id].hand, tablehand:playerList[id].tableHand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/pulltable",function(req,res) {
    if(!req.body.card)
        return
    let id = parseInt(req.body.id);
    let card = req.body.card;
    let index = myDeck.FindIndex(card,playerList[id].tableHand);
    if(index != -1){
        playerList[id].tableHand.splice(index, 1);
        playerList[id].hand[playerList[id].hand.length] = card;
    }
    for(let card in playerList[id].hand){
        if(playerList[id].hand[card] == null){
            myHand.splice(card, 1);
        }
    }
    res.json({hand:playerList[id].hand, tablehand:playerList[id].tableHand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/discard",function(req,res) {
    if(!req.body.card)
        return
    let id = parseInt(req.body.id);
    let card = req.body.card;
    myDeck.Discard(card);
    let index = myDeck.FindIndex(card,playerList[id].hand);
    if(index != -1){
        playerList[id].hand.splice(index, 1);
        for(let card in playerList[id].hand){
            if(playerList[id].hand[card] == null){
                myHand.splice(card, 1);
            }
        }
    }
    res.json({hand:playerList[id].hand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/cleartable",function(req,res) {
    if(!req.body.table)
        return
    let id = parseInt(req.body.id);
    let table = req.body.table;
    for(let card in table){
        if(table[card] !=null){
            myDeck.Discard(table[card]);
            let index = myDeck.FindIndex(table[card],playerList[id].tableHand);
            if(index != -1){
                playerList[id].tableHand.splice(index, 1);
            }
        }
    }
    res.json({tablehand:playerList[id].tableHand});
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function validString(string) {
    let regex =  /^[A-Za-z0-9 ]*[A-Za-z0-9 ]*$/;
    let  validString = regex.test(string);
    return (validString);
 }
 ////////////////////////////////////////////////////////////////////////////////////////////////////////
 timeFunction();
 function timeFunction() {
     if(infinite == true && gameActive){
        myDeck.DiscardToMain();
     }
     let numMilliSeconds = 250;
     setTimeout(timeFunction, numMilliSeconds);
 }

module.exports = router;
