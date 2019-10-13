const Discord = require('discord.js');
module.exports.run = async (client,message,args) => {
    let embed = new Discord.RichEmbed()
    .setTitle("Commands for Chess Bot")
    .setColor(0x00AE86)
    .addField("?chess","Use this command to start a game of chess.")
    .addField("?moves [square]","Use this command to find any moves from a given square. Only works if you are in a chess game against the bot.")
    .addField("?move [square1] [square2]","Use this command to move from square 1 to square 2. Only works if you are in a chess game against the bot.")
    .addField("?help","Use this command to get a list of commands for the bot")
    .addField("?quit","Use this command to quit the chess game. Only works while you are playing against the bot");
    message.channel.send({embed});
}
module.exports.help = {
	name: "help"
}