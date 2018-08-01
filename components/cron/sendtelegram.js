#!/usr/bin/env node
const TelegramBot = require('node-telegram-bot-api');

var args = process.argv.slice(2);

 

// replace the value below with the Telegram token you receive from @BotFather
//const token = '689353297:AAHYhFYM3IstFI-vIGwQ0LjqjiqVc4NyKMI';
const token = require('./../../config_telegram').token;
console.log(token)
const CHAT_ID='285957520' 


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {});

var message=""
if (args.length >1)
  message=args.reduce((x,y)=>x+" "+y)

sendMessage(bot,CHAT_ID,message)

//// Matches "/echo [whatever]"
//bot.onText(/\/echo (.+)/, (msg, match) => {
//  // 'msg' is the received Message from Telegram
//  // 'match' is the result of executing the regexp above on the text content
//  // of the message
// 
//  const chatId = msg.chat.id;
//  const resp = match[1]; // the captured "whatever"
// 
//  // send back the matched "whatever" to the chat
//  bot.sendMessage(chatId, resp);
//});
// 
//// Listen for any kind of message. There are different kinds of
// messages.
//bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
// 
//  // send a message to the chat acknowledging receipt of their message
//  bot.sendMessage(chatId, 'Received your message '+chatId);
//});


function sendMessage(bot,chatId,msg){
  bot.sendMessage(chatId,msg);
}