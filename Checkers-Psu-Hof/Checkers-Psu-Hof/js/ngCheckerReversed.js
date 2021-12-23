// JavaScript Document

angular.module('ngCheckers', [])

	.controller('checkerCtrl', function($scope, $timeout)
	{
	
	var RED = "Red", BLACK = "Black", BOARD_WIDTH = 8, selectedSquare = null, gameover = false;

	function Piece(player, x, y)
	{
		this.player = player;
		this.x = x;
		this.y = y;
		this.isKing = false;
		this.isChoice = false;
	}

	 $scope.board = [];

	//function Promote
	function promote()
	{
	    if($scope.player == BLACK && piece.y === 0)
	    {
	        piece.isKing = true;
	    }

	    if($scope.player !== BLACK && piece.y === BOARD_WIDTH-1)
	    {
	        piece.isKing = true;
	    }
	}

	//function move
	function move()
    {
        if($scope.player == BLACK && piece.isKing)
        {

        }
        else if($scope.player !== BLACK && piece.isKing)
        {

        }
        else
        {
             if($scope.player == BLACK)
             {
                promote();
             }
             else
             {
                promote();
             }
        }
	}

	//function takeOpp

	//function showChoices
    /*function showChoices(isChoice)
    {
        if(piece.isChoice == true)
        {
            //Ob oben Links nix ist
            if($scope.board[x-1][y-1] !== $scope.player)

            //Ob oben Rechts nix ist
            if($scope.board[x+1][y-1] !== $scope.player)

            //Unten link nix ist
            if($scope.board[x-1][y+1] !== $scope.player)

            //unten rechts nix ist
            if($scope.board[x+1][y+1] !== $scope.player)
            //alle Rand fälle
            if(piece.x === 0)
            {
            }
            else

            if(piece.x === BOARD_WIDTH-1)
            {
            }
            else

            if(piece.y === 0)
            {
            }
            else

            if(piece.y === BOARD_WIDTH-1)
            {}
            else

        }
    }*/

	//function selectPiece
    $scope.select = function(square)
    {
        if (piece.player === $scope.player)
        {
            selectedSquare = square;
            piece.isChoice = true;
            showChoices(isChoice);
        }
        else
       {
            piece.isChoice = false;
            selectedSquare = null;
       }
       console.log($scope.board);
    }

	//function checkWinner
	function checkWinner()
	{
	    if ($scope.redScore > 7)
	    {
            gameover = true;
            winner = P1;
        }
        if ($scope.blackScore > 7)
        {
            gameover = true;
            winner = P2;
        }
	}

	//function ChangeTurn
	function changeTurn()
	{
        start = null;
        switch ($scope.player)
        {
            case P1:
                $scope.player = RED;
            break;
            case P2:
                $scope.player = BLACK;
            break;
            default:
            break;
        }
    }

	//function createJasonObject

	$scope.newGame = function()
	{
	    $scope.playerTurn = BLACK;
		$scope.player = BLACK;
		$scope.redScore = 0;
		$scope.blackScore = 0;
		gameover = false;
		setBoard();
	}

	$scope.newGame();

    //Wichtig für Farben
    $scope.setColorForPieces = function(square)
    {
        if(square.player === RED)
            return {"backgroundColor" : "#FF0000"};
        else if (square.player === BLACK)
            return {"backgroundColor" : "#A3A3A3"};
         return {"backgroundColor" : "none"};
    }

    $scope.colorSquares = function(square)
    	{
    		if(square.y % 2 === 0)
    		{
    			if(square.x % 2 === 0)
    			{
    				return{"backgroundColor" : square.isChoice ? "red" : "black"};
    			}
    			else
    			{
    			return {"backgroundColor" : "white"};
    			}
    		}
    		else
    		{
    			if(square.x % 2 === 1)
    			{
    				return {"backgroundColor" : square.isChoice ? "red" : "black"};
    			}
    			else
    			{
    				return {"backgroundColor" : "white"};
    			}
    		}
    	}

    	//Macht board
        function setBoard()
        {
             for (var i = 0; i < BOARD_WIDTH; i++)
             {
                $scope.board[i] = [];
                for (var j = 0; j < BOARD_WIDTH; j++)
                {
                    if ( (i === 0 &&  j % 2 === 0) || (i === 1 && j % 2 === 1) || (i === 2 && j % 2 === 0) )
                	{
                	    $scope.board[i][j] = new Piece(BLACK, j, i);
                    }
                	else if ( (i === BOARD_WIDTH - 3 && j % 2 === 1) || (i === BOARD_WIDTH - 2 && j % 2 === 0) ||
                	(i === BOARD_WIDTH - 1 && j % 2 === 1) )
                	{
                		$scope.board[i][j] = new Piece(RED, j, i);
                	}
                	else
                	{
                	    $scope.board[i][j] = new Piece(null, j, i);
                	}
                }
             }
        }

	});

