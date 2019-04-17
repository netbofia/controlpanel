#!/usr/bin/env node
process.env.NTBA_FIX_319=true
var Promise = require('bluebird');
var TelegramBot = Promise.promisifyAll(require('node-telegram-bot-api'));


var args = process.argv.slice(2);
var config = require('./../../config_telegram')

// replace the value below with the Telegram token you receive from @BotFather
const token = config.token;
const CHAT_ID=config.chatid


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling:true});

var message=""
if (args.length >1){
  message=args.reduce((x,y)=>x+" "+y)
  sendMessage(message,bot,CHAT_ID)
}


//// Listen for any kind of message. There are different kinds of
// messages.
//bot.on('message', (msg) => {
//  const chatId = msg.chat.id;
// 
//  // send a message to the chat acknowledging receipt of their message
//  console.log(msg)
//  bot.sendMessage(chatId, 'Received your message '+chatId);
//});

function listenForMessage(){
	//receive call back with the logic 
	// reply to https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#TelegramBot+onReplyToMessage

	return new Promise(function(res,rej){
		var result={action:false,server:""}

		bot.onText(/restart server (.+)/, (msg, match) => {
		  const chatId = msg.chat.id;
		  // 
		  // send a message to the chat acknowledging receipt of their message
		 
		  var server=match[1]
		  
		  if( server == "test"){  //in array
			bot.sendMessage(chatId, 'Received your request! Restarting '+server);
			result.action=true	  	
			result.server=server

		  	res(result)

		  }
		});
	})
}



function sendMessage(msg,chatId){
  chatId=chatId || CHAT_ID
  bot.sendMessage(chatId,msg);
}


module.exports={
	sendMSG:sendMessage,
	listen:listenForMessage,
	bot:bot
}