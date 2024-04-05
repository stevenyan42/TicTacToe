const gameboard = (function(){
    let board = [['','',''],
                 ['','',''],
                 ['','','']];
    //temp
    const printBoard = () => {
        console.log(board);
    };
    //temp
    const printSpace = (row, col) => {
        console.log(board[row][col]);
    };

    const clearBoard = () => {
        board.forEach(row => {
            row.fill('');
        });
    };

    const checkBoardTie = () => {
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (board[row][col] === ''){
                    return false;
                }
            }
        }
        return true;
    }

    const checkBoardWin = () => {
        // Check rows
        for (let row = 0; row < 3; row++) {
            if (board[row][0] !== '' && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                return true;
            }
        }
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (board[0][col] !== '' && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                return true;
            }
        }
        // Check diagonals
        if (board[0][0] !== '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return true;
        }
        if (board[0][2] !== '' && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return true;
        }
        // If no winning line is found
        return false;
    };

    const getBoardSpace = (row, col) => {
        return board[row][col];
    };

    const setBoardSpace = (row, col, marker) => {
        board[row][col] = marker;
    };

    return {
        printBoard,
        printSpace,
        clearBoard,
        checkBoardTie,
        checkBoardWin,
        getBoardSpace,
        setBoardSpace
    };
})();

const gameDisplay = (function(){
    const gameboard = document.querySelector('.gameboard');
    const message = document.querySelector('.message');

    const displayBoard = (playTurn) => {
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                const cell = document.createElement('button');
                cell.classList.add('cell');
                cell.setAttribute("id", `cell${row}-${col}`);
                cell.textContent = '';
                gameboard.appendChild(cell);

                cell.addEventListener('click', () => {
                    playTurn(row, col);
                    cell.disabled = true;
                })
            }
        }
    };

    const updateCell = (row, col, marker) => {
        const cell = document.querySelector(`#cell${row}-${col}`);
        cell.textContent = `${marker}`;
    }

    const updateMessage = (text) => {
        message.textContent = `${text}`
    }

    const clearCells = () => {
        gameboard.textContent = '';
    }

    const disableBoard = () => {
        const cells = gameboard.childNodes;
        cells.forEach((cell)=> {
            cell.disabled = true;
        });
    }

    return {
        displayBoard,
        updateCell,
        updateMessage,
        clearCells,
        disableBoard
    };
})();

class Player {

    constructor(marker, name) {
        this.marker = marker;
        this.name = name;
    }
};

const gameController = (function(board, display){

    let playerOne;
    let playerTwo;
    let currPlayer = 1;
    const newGameButton = document.querySelector(".new-game");

    const createPlayers = (name1, name2) => {
        playerOne = new Player("x", name1);
        playerTwo = new Player("o", name2);
    };

    const setPlayerTurn = () => {
        currPlayer = currPlayer === 1 ? 2 : 1;
    };

    const startGame = () => {
        createPlayers("play1", "play2");
        board.clearBoard();
        display.clearCells();
        display.displayBoard(playTurn);
        currPlayer = 1;
        console.log(`player${playerOne.name}'s turn`);
        display.updateMessage(`${playerOne.name}'s Turn`);
        //fordebugging
        //board.printBoard();
    };

    const playTurn = (row, col) => {
        if (board.getBoardSpace(row, col) !== '') {
            //invalid space condition
            console.log("invalid space");
            return;
        }

        if (currPlayer === 1) {
            playSpace(row, col, playerOne);
        } else {
            playSpace(row, col, playerTwo);
        }

        if (board.checkBoardWin()){
            if (currPlayer === 1){
                //player1 win
                console.log("player1 wins");
                display.updateMessage(`${playerOne.name} Wins!`);
                display.disableBoard();
                return;
            } else {
                //player2 win
                console.log("player2 wins")
                display.updateMessage(`${playerTwo.name} Wins!`);
                display.disableBoard();
                return;
            }
        } else if (board.checkBoardTie()){
            //tie
            console.log("tie");
            display.updateMessage("It's a Tie!");
            return;
        }

        setPlayerTurn();
        if (currPlayer === 1){
            display.updateMessage(`${playerOne.name}'s Turn`);
        } else {
            display.updateMessage(`${playerTwo.name}'s Turn`);
        }
        //fordebugging
        board.printBoard();

    };

    const playSpace = (row, col, player) => {
        board.setBoardSpace(row, col, player.marker);
        display.updateCell(row, col, player.marker);
    };

    newGameButton.addEventListener("click", startGame);

    return {
        startGame,
        playTurn
    };
})(gameboard, gameDisplay);