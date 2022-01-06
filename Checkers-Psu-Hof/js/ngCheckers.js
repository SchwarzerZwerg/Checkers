// JavaScript Document
var app = angular.module('checkersApp', []);
app.controller('checkerCtrl', function($scope, $timeout)
{
	var RED = "Red", BLACK = "Black", BOARD_WIDTH = 8, selectedSquare = null;

    //Funktion zum setzten der Steine, dies haben eigenschaften wie isKing oder isChoice wichtig für Züge etc.
	function Piece(player, x, y)
	{
		this.player = player;
		this.x = x;
		this.y = y;
		this.isKing = false;
		this.isChoice = false;
		this.matados = [];
	}

    //Funktion zum Initialisieren des Bretts, wer am Zug ist und des Scores der beiden Spieler
	$scope.newGame = function()
    {
        $scope.player = RED;
    	$scope.redScore = 0;
    	$scope.blackScore = 0;

        //Erzeugen des Boardes
    	$scope.board = [];
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

    //Aufruf der NewGame Funktion
    $scope.newGame();

    //Funktion wenn ein Feld angeklickt wird
    $scope.select = function(square)
    {
        if(selectedSquare !== null && !square.player)
        {
            movePiece(square);
            resetChoices();
        }
        else if(square.player === $scope.player)
        {
            selectedSquare = square;
            resetChoices();
            setChoices(selectedSquare.x, selectedSquare.y, 1, [], -1, -1, square.isKing);
        }
        else
        {
            selectedSquare = null;
        }
        console.log($scope.board);
        console.log(square);
    }

    function resetChoices()
    {
        for(var i = 0; i < BOARD_WIDTH; i++)
        {
            for(var j = 0; j < BOARD_WIDTH; j++)
            {
                $scope.board[i][j].isChoice = false;
                $scope.board[i][j].matados = [];
            }
        }
    }

    function movePiece(square)
    {
        if(square.isChoice)
        {
            var becomeKing = selectedSquare.isKing;
            for(var i = 0; i < square.matados.length; i++)
            {
                var matado = square.matados[i];
                jump(matado);
                becomeKing = becomeKing || becomeKingAfterJump(matado.x,matado.y);
            }
            square.player = selectedSquare.player;
            square.isKing = becomeKing || isKing(square);
            selectedSquare.player = null;
            selectedSquare.isKing = false;
            $scope.player = $scope.player === RED ? BLACK:RED
        }
    }

    function isKing(square)
    {
        if(isKing === true)
            return true;
        else if($scope.player === RED)
        {
            if(square.y === 0)
                return true;
        }
        else
        {
            if(square.y === BOARD_WIDTH-1)
                return true;
        }
        return false;
    }

    function becomeKingAfterJump(x,y)
    {
        return($scope.player === RED && y == 1) || ($scope.player === BLACK && y == BOARD_WIDTH -2);
    }

    function jump(jumped)
    {
        jumped.player = null;
        if($scope.player === RED)
        {
            $scope.redScore++;
            if($scope.redScore === 8)
            {
                $timeout(function(){
                    gameOver();
                }, 50)
            }
        }
        else
        {
            $scope.blackScore++;
            if($scope.blackScore === 8)
            {
                $timeout(function(){
                gameOver();
                },50)

            }
        }
        console.log("jumped");
    }

    // setChoices erweitern für den König
    //Depth ist nötig für das Übersrpingen einer anderen Figur
    function setChoices(x, y, depth, matados, oldX, oldY, isKing)
	{
      if (depth > 10) return;

      isKing = isKing || ($scope.player === RED && y == 0) || ($scope.player === BLACK && y == BOARD_WIDTH - 1);
      // Upper Choices
      if ($scope.player === RED && !isKing)
	  {
        // Upper Left
        if (x > 0 && y > 0)
		{
          var UP_LEFT = $scope.board[y-1][x-1];
          if (UP_LEFT.player)
		  {
            if (UP_LEFT.player !== $scope.player)
			{
              if ((x > 1 && y > 1) && !(x - 2 === oldX && y - 2 === oldY))
			  {
                var UP_LEFT_2 = $scope.board[y-2][x-2];
                if (!UP_LEFT_2.player)
				{
                  UP_LEFT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(UP_LEFT) === -1)
                    jumpers.push(UP_LEFT);
                  UP_LEFT_2.matados = jumpers;
                  setChoices(x-2,y-2,depth+1,jumpers,x,y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            UP_LEFT.isChoice = true;
          }
        }

        // Upper Right
        if (x < BOARD_WIDTH - 1 && y > 0)
		{
          var UP_RIGHT = $scope.board[y-1][x+1];
          if (UP_RIGHT.player) {
            if (UP_RIGHT.player !== $scope.player)
			{
              if ((x < BOARD_WIDTH - 2 && y > 1) && !(x + 2 === oldX && y - 2 === oldY))
			  {
                var UP_RIGHT_2 = $scope.board[y-2][x+2];
                if (!UP_RIGHT_2.player)
				{
                  UP_RIGHT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(UP_RIGHT) === -1)
                    jumpers.push(UP_RIGHT);
                  UP_RIGHT_2.matados = jumpers;
                  setChoices(x+2,y-2,depth+1,jumpers,x,y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            UP_RIGHT.isChoice = true;
          }
        }
      }

      // Lower Choices
      if ($scope.player === BLACK && !isKing)
	  {
        // Lower Left
        if (x > 0 && y < BOARD_WIDTH - 1)
		{
          var LOWER_LEFT = $scope.board[y+1][x-1];
          if (LOWER_LEFT.player)
		  {
		    //Wenn sich auf dem LowerLeft Feld eine Spiel Figur von dem Gegner befindet
		    //dann wird Feld dahinter ermittelt und dorthin gesprungen
            if (LOWER_LEFT.player !== $scope.player)
			{
			    //Feld dahinter Ermitteln und abgleichen ob es nicht das Startfeld ist
              if ((x > 1 && y < BOARD_WIDTH - 2) && !(x - 2 === oldX && y + 2 === oldY))
			  {
                var LOWER_LEFT_2 = $scope.board[y+2][x-2];
                if (!LOWER_LEFT_2.player)
				{
				    // Taking a Piece and moving to the Filed behind
                  LOWER_LEFT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(LOWER_LEFT) === -1)
                    jumpers.push(LOWER_LEFT);
                  LOWER_LEFT_2.matados = jumpers;
                  setChoices(x-2,y+2,depth+1,jumpers,x,y,isKing);
                }
              }
            }
          }
		  else if (depth === 1)
		  {
            LOWER_LEFT.isChoice = true;
          }
        }

        // Lower Right
        if (x < BOARD_WIDTH - 1 && y < BOARD_WIDTH - 1)
		{
          var LOWER_RIGHT = $scope.board[y+1][x+1];
          if (LOWER_RIGHT.player)
		  {
            if (LOWER_RIGHT.player !== $scope.player)
			{
              if ((x < BOARD_WIDTH - 2 && y < BOARD_WIDTH - 2) && !(x + 2 === oldX && y + 2 === oldY))
			  {
                var LOWER_RIGHT_2 = $scope.board[y+2][x+2];
                if (!LOWER_RIGHT_2.player)
				{
                  LOWER_RIGHT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(LOWER_RIGHT) === -1)
                    jumpers.push(LOWER_RIGHT);
                  LOWER_RIGHT_2.matados = jumpers;
                  setChoices(x+2,y+2,depth+1,jumpers,x,y,isKing);
                }
              }
            }
          }
		  else if (depth === 1)
		  {
            LOWER_RIGHT.isChoice = true;
          }
        }
      }

      if(isKing)
      {
        checkTopRightKing(x, y);
        checkTopLeftKing(x,y);
        checkBottomLeftKing(x,y);
        checkBottomRightKing(x,y);
      }
      }


    //Funktion zum setzten der Steine, aufgerufen im HTML
    $scope.setStones = function(square)
    {
        if(square.player === RED)
            return{"backgroundColor": "red"};
        else if(square.player === BLACK)
            return{"backgroundColor": "grey"};
        return{"backgroundColor": "none"};
    }

    //Funktion zum setzten der Squares, aufgerufen im HTML
    $scope.setSquares = function(square)
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

    // In setCoices mit Reinarbeiten für die Funktionalität Springen zu müssen
    function canTake(square)
    {
        if(selectedSquare === $scope.player && square !== $scope.player && square !== null)
            return true;
        else
            return false;
    }

    function gameOver() {
            if($scope.redScore === 8)
                $scope.alert(red);
            else if($scope.blackScore === 8)
                $scope.alert(black)
        }

    function checkTopRightKing(x, y)
        {
          if(x < 7 && y > 0)
          {
            if($scope.board[y - 1][x + 1].player === null) //Oben rechts = freies Feld
            {
              $scope.board[y - 1][x + 1].isChoice = true;
              checkTopRightKing(x + 1, y - 1);
            }
            else
            {
              checkTopRight(x, y);
            }
          }

        }

        function checkTopLeftKing(x, y)
        {
          if(x > 0 && y > 0)
          {
            if($scope.board[y - 1][x - 1].player === null) //Oben links = freies Feld
            {
              $scope.board[y - 1][x - 1].isChoice = true;
              checkTopLeftKing(x - 1, y - 1);
            }
            else if($scope.board[y-1][x-1].player !== $scope.player)
            {
               $scope.board[y-1][x-1].isChoice = false;
                checkTopLeft(x, y);
            }
            else
            {
                checkTopLeft(x,y);
            }
          }

        }

        function checkBottomRightKing(x, y)
        {
          if(x < 7 && y < 7)
          {
            if($scope.board[y + 1][x + 1].player === null) //Unten rechts = freies Feld
            {
              $scope.board[y + 1][x + 1].isChoice = true;
              checkBottomRightKing(x + 1, y + 1);
            }
            else
            {
              checkBottomRight(x, y);
            }
          }

        }

        function checkBottomLeftKing(x, y)
        {
          if(x > 0 && y < 7)
          {
            if($scope.board[y + 1][x - 1].player === null) //Unten links = freies Feld
            {
              $scope.board[y + 1][x - 1].isChoice = true;
              checkBottomLeftKing(x - 1, y + 1);
            }
            else
            {
              checkBottomLeft(x, y);
            }
          }
        }

            function checkTopRight(x, y)
            {
              var attack = false;
              if(y > 0)
              {
                if($scope.board[y - 1][x + 1].player === null) //Oben rechts = freies Feld
                {
                  $scope.board[y - 1][x + 1].isChoice = true; //Freies Feld oben rechts wird Auswahl
                }
                else //Oben rechts liegt ein Spieler
                {
                  if($scope.board[y - 1][x + 1].player !== $scope.player) //Oben rechts liegt ein Gegner
                  {
                    if(x < 6 && y > 1) //Wenn rechts hinter dem Gegner noch Platz ist
                    {
                      if($scope.board[y - 2][x + 2].player === null)//Wenn hinter dem Gegner das Feld frei ist
                      {
                      $scope.board[y - 2][x + 2].isChoice = true; //Feld hinter Gegner wird ausgewählt
                      attack = true;
                      }
                    }
                  }
                }
              }
              return attack;
            }

            function checkTopLeft(x, y)
            {
              var attack = false;
              if($scope.board[y - 1][x - 1].player === null) //Oben links = freies Feld
              {
                $scope.board[y - 1][x - 1].isChoice = true; //Freies Feld oben links wird Auswahl
              }
              else //Oben links liegt ein Spieler
              {
                if($scope.board[y - 1][x - 1].player !== $scope.player) //Oben links liegt ein Gegner
                {
                  if(x > 1 && y > 1) //Wenn links hinter dem Gegner noch Platz ist
                  {
                    if($scope.board[y - 2][x - 2].player === null)//Wenn hinter dem Gegner das Feld frei ist
                    {
                      $scope.board[y - 2][x - 2].isChoice = true; //Feld hinter Gegner wird ausgewählt
                      attack = true;
                    }
                  }
                }
              }
              return attack;
            }

            function checkBottomRight(x, y)
            {
              var attack = false;
              if($scope.board[y + 1][x + 1].player === null) //Unten rechts = freies Feld
              {
                $scope.board[y + 1][x + 1].isChoice = true; //Freies Feld unten rechts wird Auswahl
              }
              else //Unten rechts liegt ein Spieler
              {
                if($scope.board[y + 1][x + 1].player !== $scope.player) //Unten rechts liegt ein Gegner
                {
                  if(x < 6 && y < 6)
                  {
                    if($scope.board[y + 2][x + 2].player === null) //Wenn hinter dem Gegner das Feld frei ist
                    {
                      $scope.board[y + 2][x + 2].isChoice = true; //Feld hinter Gegner wird ausgewählt
                      attack = true;
                    }
                  }
                }
              }
              return attack;
            }

            function checkBottomLeft(x, y)
            {
              var attack = false;
              if($scope.board[y + 1][x - 1].player === null) //Unten links = freies Feld
              {
                $scope.board[y + 1][x - 1].isChoice = true; //Freies Feld unten links wird Auswahl
              }
              else //Unten links liegt ein Spieler
              {
                if($scope.board[y + 1][x - 1].player !== $scope.player) //Unten links liegt ein Gegner
                {
                  if(x > 1 && y < 6)
                  {
                    if($scope.board[y + 2][x - 2].player === null) //Wenn hinter dem Gegner das Feld frei ist
                    {
                      $scope.board[y + 2][x - 2].isChoice = true; //Feld hinter Gegner wird ausgewählt
                      attack = true;
                    }
                  }
                }
              }
              return attack;
            }
});

