const Discord = require('discord.js');
const Chess = require('chess.js').Chess;
const chess = new Chess();
const chessfunc = require('./chessfunc');
//chess game
module.exports.run = async (bot, message, args) => {
	message.channel.send('Use the command "?moves [square]" to get a valid list of moves from that square ex  ::  "?moves e2"\nUse the command "?move [moveFrom] [moveTo]" to move a piece  ::  "?move e2 e4"');
	while(!chess.game_over()){
		message.channel.send('```'+chess.ascii()+'```');
		message.channel.send('It is your turn');
		//collect next message of the player 
		var collected = await message.channel.awaitMessages(msg =>  msg.author.id === message.author.id, {max:1});
		//split message into array 
		var messageArray = collected.array().toString().split(' ');
		if(messageArray[0] === '?moves'){
			//find valid moves from a square
			var moveList = chess.moves({square:messageArray[1]});
			if(moveList.length != 0){
                message.channel.send(`Available moves from square ${messageArray[1]} are ${moveList.toString()}`);
            }
			else {
				message.channel.send('That is not a valid square!');
			}
			continue;
		}
		else if(messageArray[0] === '?move'){
			//get the from square and to square and move to that position
			var moveFrom = messageArray[1];
			var moveTo = messageArray[2];
            if (chess.moves({ square: moveFrom }).length === 0 || !chess.move({ from: moveFrom, to: moveTo })) {
                message.channel.send('That is not valid!');
				continue;
			}
			else {
				chess.move({from:moveFrom,to:moveTo});
				//computer move using minimax depth 3
				var computerMove = chessfunc.minimaxRoot(3,chess,true);
				if(!computerMove) {
					break;
				}
				chess.move(computerMove);
                message.channel.send(`I moved to ${computerMove}`);
			}
		}
		else {
			message.channel.send('That is not a valid command');
		}
	}

}

module.exports.help = {
	name: "chess",
	function : "play a game of chess against shitty minimax alg"
}