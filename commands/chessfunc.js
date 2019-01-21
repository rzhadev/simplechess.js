module.exports.basicMoveCalc = (chess) => {
    var moves = chess.moves();
    return moves[Math.floor(Math.random()*moves.length)];
}
module.exports.calcBetterMove = function(chess) {

    var moves = chess.moves();
    var bestMove = null;
    var bestValue = -9999;

    for(var i = 0; i < moves.length; i++) {
        var move = moves[i];
        chess.move(move);
        //take negative value 
        var boardValue = -evaluateBoard(chess);
        chess.undo();
        if(boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }

    return bestMove;

};
var evaluateBoard = function (chess) {
    //letters of columns
	var letters = ['a','b','c','d','e','f','g','h'];
	//numbers of rows
	var nums = ['1','2','3','4','5','6','7','8'];
	//magic numbers
	var COLUMNS = 8;
	var ROWS = 8;
	//total of board evaluation 
	var total = 0; 
	for(var i = 0; i < COLUMNS; i++){
		var column = letters[i];
		for(var k = 0; k < ROWS; k++){
			var row = nums[k];
			total += getPieceValue(chess.get(column+row), i, k);
		}
	}
	return total;
};

var getPieceValue = function (piece, posX, posY) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, white, posX, posY) {
        //get the value of the piece + bias from their position on the board 
        var pieceType = piece.type;
        if (pieceType === 'p') {
            return 10 + (white ? pawnEvalWhite[posY][posX] : pawnEvalBlack[posY][posX]);
        } 
        else if (pieceType === 'r') {
            return 50 + (white ? rookEvalWhite[posY][posX] : rookEvalBlack[posY][posX]);
        } 
        else if (pieceType === 'n') {
            return 30 + knightEval[posY][posX];
        } 
        else if (pieceType === 'b') {
            return 30 + (white ? bishopEvalWhite[posY][posX] : bishopEvalBlack[posY][posX]);
        } 
        else if (pieceType === 'q') {
            return 90 + evalQueen[posY][posX];
        } 
        else if (pieceType === 'k') {
            return 900 + (white ? kingEvalWhite[posY][posX] : kingEvalBlack[posY][posX]);
        }
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', posX, posY);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

var minimax = function(depth, chess, alpha, beta , maximizingPlayer) {
    //if node is the root 
    if(depth === 0){
        return -evaluateBoard(chess);
    }
    var moves = chess.moves();
    //max alg 
    if(maximizingPlayer){
        var bestMove = -9999;
        for(var i = 0; i < moves.length; i++){
            var move = moves[i];
            chess.move(move);
            //recursively check which node has the highest value 
            bestMove = Math.max(bestMove, minimax(depth-1, chess, alpha, beta, !maximizingPlayer));
            chess.undo();
            alpha = Math.max(alpha, bestMove);
            if( beta <= alpha) {
                return bestMove; 
            }
        }
        return bestMove; 
    }
    //min alg 
    else {
        var bestMove = -9999; 
        for(var i = 0; i < moves.length; i++){
            var move = moves[i];
            chess.move(move);
            //recursively check each node and find the min value 
            bestMove = Math.min(bestMove, minimax(depth-1, chess, alpha, beta, !maximizingPlayer));
            chess.undo();
            beta = Math.min(beta, bestMove);
            if(beta <= alpha){
                return bestMove;    
            }
        }
        return bestMove; 
    }
}
module.exports.minimaxRoot = function(depth, chess, maximizingPlayer) {
    //minimax with alpha beta pruning 
    if(depth === 0){
        return -evaluateBoard(chess);
    }
    var moves = chess.moves();
    var bestMove = -9999; 
    var foundMove; 
    for(var i = 0; i < moves.length; i++){
        var move = moves[i];
        chess.move(move);
        var value = minimax(depth-1,chess,-30000,30000,!maximizingPlayer);
        chess.undo();
        if(value >= bestMove){
            bestMove = value; 
            foundMove = move; 
        }
    }
    return foundMove; 
}
var reverseArray = function(array) {
    return array.slice().reverse();
};


//advanced position evaluation 

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

module.exports.help = { 
    name: "chess algorithms",
}