//discord.js
const Discord = require('discord.js');
const googleProfanityWords = require('google-profanity-words')
const client = new Discord.Client();
const config = require('./config.json');
//https://rzha1.github.io

//node file systems soon tm 
const fs = require('fs');
client.commands = new Discord.Collection();
//command handler
fs.readdir('./commands/', (err,files) => {
	if(err){
		console.log(err);
	}
	let jsfile = files.filter(f => f.split('.').pop() === 'js')
	if(jsfile.length === 0){
		console.log('could not find commands');
		return; 
	}
	jsfile.forEach((f,i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		client.commands.set(props.help.name, props);
	});
});

client.on('ready', () => {
	console.log('Connected as '+ client.user.tag);
});

client.on('message', message => {
	
	//if the message is from a bot do nothing
	if(message.author.bot){
		return; 
	}
	let messageArray = message.content.split(' ');
	let prefix = config.prefix;
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
	let commandfile = client.commands.get(cmd.slice(prefix.length));
	if(commandfile) {
		commandfile.run(client,message,args);
	}
	/*
		
	}
	//profanity filter v2
	else {
			//content of a sent message
		var sentMessage = message.content; 
		//username of the user that sent the message with a capitalized first letter
		var user = message.author.tag;
		//split message into an array to search for bad words
		var messageArray = sentMessage.split(" ");
		//list of bad words 
		var badWords = googleProfanityWords.list();
		//look through all the words in message and see if it is in the list of bad words
		else {
			for(var i = 0; i < messageArray.length; i++) {
				var word = messageArray[i].toLowerCase();	
				if(badWords.includes(word)){
					message.channel.send(user+' said '+message+', I heard that!');
					break;		
				}
			}
		}
	}
	*/
});
client.login(config.token);


//error stuff
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug",(e) => console.debug(e));