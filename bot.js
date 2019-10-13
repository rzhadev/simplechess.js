//discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
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
});
client.login(config.token);

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.debug(e));