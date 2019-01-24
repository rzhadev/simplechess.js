const Chess = require('chess.js').Chess;
const chess = new Chess();
var minimaxRoot = function (depth, chess, maxplayer) {
    var moves = chess.moves();
    let bestValue = 0;
    let bestMove;
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        chess.move(move);
        var value = minimax(depth - 1, chess, -10000, 10000, !maxplayer);
        chess.undo();
        if (value >= bestValue) {
            bestMove = move;
            bestValue = value;
        }
    }
    return bestMove;
}
var evaluateBoard = function (chess) {
    //letters of columns
    let columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    //numbers of rows
    let rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let total = 0;
    for (var i = 0; i < columns.length; i++) {
        let column = columns[i];
        for (var k = 0; k < rows.length; k++) {
            let row = rows[k];
            let value = getPieceValue(chess.get(column + row), i, k);
            total += value;
        }
    }
    return total;
}
var minimax = (depth, chess, alpha, beta, maxplayer) => {
    if (depth === 0) {
        return -evaluateBoard(chess);
    }
    var moves = chess.moves();
    if (maxplayer) {
        var value = -9999;
        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];
            chess.move(move);
            value = Math.max(value, minimax(depth - 1, chess, alpha, beta, !maxplayer));
            chess.undo();
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    }
    else {
        var value = 9999;
        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];
            chess.move(move);
            var value = Math.min(value, minimax(depth - 1, chess, alpha, beta, true));
            chess.undo();
            beta = Math.min(beta, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    }
}
var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, x, y) {
        if (piece.type === 'p') {
            return 10 + (piece.color === 'w' ? pawnTable[x][y] : reverseTable(pawnTable)[x][y]);
        } else if (piece.type === 'r') {
            return 50 + (piece.color === 'w' ? rookTable[x][y] : reverseTable(rookTable)[x][y]);
        } else if (piece.type === 'n') {
            return 30 + (piece.color === 'w' ? knightTable[x][y] : reverseTable(knightTable)[x][y]);
        } else if (piece.type === 'b') {
            return 30 + (piece.color === 'w' ? bishopTable[x][y] : reverseTable(bishopTable)[x][y]);
        } else if (piece.type === 'q') {
            return 90 + (piece.color === 'w' ? queenTable[x][y] : reverseTable(queenTable)[x][y]);
        } else if (piece.type === 'k') {
            return 900 + (piece.color === 'w' ? kingTable[x][y] : reverseTable(kingTable)[x][y]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, x, y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

var pawnTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

var knightTable = [[-50, -40, -30, -30, -30, -30, -40, -50],
[-40, -20, 0, 0, 0, 0, -20, -40],
[-30, 0, 10, 15, 15, 10, 0, -30],
[-30, 5, 15, 20, 20, 15, 5, -30],
[-30, 0, 15, 20, 20, 15, 0, -30],
[-30, 5, 10, 15, 15, 10, 5, -30],
[-40, -20, 0, 5, 5, 0, -20, -40],
[-50, -40, -30, -30, -30, -30, -40, -50]];

var bishopTable = [[-20, -10, -10, -10, -10, -10, -10, -20],
[-10, 0, 0, 0, 0, 0, 0, -10],
[-10, 0, 5, 10, 10, 5, 0, -10],
[-10, 5, 5, 10, 10, 5, 5, -10],
[-10, 0, 10, 10, 10, 10, 0, -10],
[-10, 10, 10, 10, 10, 10, 10, -10],
[-10, 5, 0, 0, 0, 0, 5, -10],
[-20, -10, -10, -10, -10, -10, -10, -20]];

var rookTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]];

var queenTable = [[-20, -10, -10, -5, -5, -10, -10, -20],
[-10, 0, 0, 0, 0, 0, 0, -10],
[-10, 0, 5, 5, 5, 5, 0, -10],
[-5, 0, 5, 5, 5, 5, 0, -5],
[0, 0, 5, 5, 5, 5, 0, -5],
[-10, 5, 5, 5, 5, 5, 0, -10],
[-10, 0, 5, 0, 0, 0, 0, -10],
[-20, -10, -10, -5, -5, -10, -10, -20]];

var kingTable = [[-30, -40, -40, -50, -50, -40, -40, -30],
[-30, -40, -40, -50, -50, -40, -40, -30],
[-30, -40, -40, -50, -50, -40, -40, -30],
[-30, -40, -40, -50, -50, -40, -40, -30],
[-20, -30, -30, -40, -40, -30, -30, -20],
[-10, -20, -20, -20, -20, -20, -20, -10],
[20, 20, 0, 0, 0, 0, 20, 20],
[20, 30, 10, 0, 0, 10, 30, 20]];

var reverseTable = table => {
    return table.reverse();
}
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
                chess.move({ from: moveFrom, to: moveTo });
				//computer move using minimax depth 3
                var computerMove = minimaxRoot(3, chess, true);
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