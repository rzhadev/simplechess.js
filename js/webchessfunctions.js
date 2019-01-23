// to do 
// make function to evaluate a piece for a color only if the piece is not null :done
// make function to evaluate board for a color 
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
            let value = getPieceValue(chess.get(column + row));
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
var getPieceValue = function (piece) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') {
            return 10;
        } else if (piece.type === 'r') {
            return 50;
        } else if (piece.type === 'n') {
            return 30;
        } else if (piece.type === 'b') {
            return 30;
        } else if (piece.type === 'q') {
            return 90;
        } else if (piece.type === 'k') {
            return 900;
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};