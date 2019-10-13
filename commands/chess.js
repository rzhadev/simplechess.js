const chessfunctions = require('C:\\Users\\Richard Zha\\Documents\\smartchess.js\\js\\chessfunctions.js');
const Chess = require('chess.js').Chess;
const chess = new Chess();
module.exports.run = async (client, message, args) => {
    while(!chess.game_over()){
		message.channel.send('```'+chess.ascii()+'```');
		message.channel.send('It is your turn');
		//collect next message of the player 
		var collected = await message.channel.awaitMessages(msg =>  msg.author.id === message.author.id, {max:1});
		//split message into array 
		var messageArray = collected.array().toString().split(' ');
        var command = messageArray[0];
        if(command == '?moves'){
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
		else if(command == '?move'){
			//get the from square and to square and move to that position
			var moveFrom = messageArray[1];
			var moveTo = messageArray[2];
            if (chess.moves({ square: moveFrom }).length === 0 || !chess.move({ from: moveFrom, to: moveTo })) {
                message.channel.send('That is not valid!');
				continue;
			}
			else {
                chess.move({ from: moveFrom, to: moveTo });
				//computer move using minimax depth 3
                var computerMove = chessfunctions.minimaxRoot(3, chess, true);
                chess.move(computerMove);
                message.channel.send(`I moved to ${computerMove}`);
			}
		}
        else if(command == "?quit"){
            chess.reset();
            break;
        }
        else {
			message.channel.send('That is not a valid command');
		}
    }

}

module.exports.help = {
	name: "chess"
}
