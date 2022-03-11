class ClientGameMap {
// moving game map

    constructor(xPos, yPos){
        this.x = xPos;
        this.y = yPos;
        this.playerSpeed = 5;

        this.coords = [
        //    xpos  ypos l(x) w(y)
            [-1000, 0, 1000, 1000], //left map edge
            [-1000, -1000, 3500, 1000], //top map edge
            [-1000, 1000, 3500, 1000], //bottom map edge
            [1500, 0, 50, 1000], //right map edge
            [600, 0, 30, 200], //right spawn room wall
            [600, 400, 30, 200], //right spawn room wall
            [0, 600, 630, 30], //bottom spawn room wall
            [600, 600, 120, 30],//room under spawn connector wall
            [700, 600, 30, 100],//room under spawn top door wall
            [700, 900, 30, 100],//room under spawn bottom door wall
        ]

        

        

        let mapCoords = {
            rectCoords: this.coords,
        }

        socket.emit('mapData', mapCoords);
        this.moveData;
    }

    drawMap(){
        fill(0,0,0);
        for(var i = 0; i < this.coords.length; i++){
            rect(this.coords[i][0] + this.x, this.coords[i][1] + this.y, this.coords[i][2], this.coords[i][3] )
        }
        this.drawBullets(currentBullets);
        this.drawOtherPlayers(connectedUsersData);
    }

    move(){

        if (keyIsDown(65)) {
            if(!this.anyRectangleContains(clientPlayer.leftX, clientPlayer.y)){
                this.x += this.playerSpeed;
                //for(var i = 0; i < enemies.length; i++){
                //enemies[i].x += this.playerSpeed;
                //}
            }
            
        }
      
        if (keyIsDown(68)) {   
                if(!this.anyRectangleContains(clientPlayer.rightX, clientPlayer.y)){
                this.x -= this.playerSpeed;
                //for(var i = 0; i < enemies.length; i++){
                //enemies[i].x -= this.playerSpeed;
                //}
            }
            
        }
      
        if (keyIsDown(87)){
                if(!this.anyRectangleContains(clientPlayer.x, clientPlayer.topY)){
                this.y += this.playerSpeed;
                //for(var i = 0; i < enemies.length; i++){
                //enemies[i].y += this.playerSpeed;
                //}
            }
        }
      
        if (keyIsDown(83)) {
                if(!this.anyRectangleContains(clientPlayer.x, clientPlayer.bottomY)){
                this.y -= this.playerSpeed;
                //for(var i = 0; i < enemies.length; i++){
                //enemies[i].y -= this.playerSpeed;
                //}
            }
            
        }
        this.moveData = {
            index: clientPlayer.index,
            decX: this.decimalPlayerLocationX(),
            decY: this.decimalPlayerLocationY()
        };
        

    }
    
    decimalPlayerLocationX(){
        return (clientPlayer.x - this.x) / 1000;
    }
    decimalPlayerLocationY(){
        return (clientPlayer.y - this.y)/ 1500;
    }
    returnPlayerLocationX(decimal){
        return (1000 * decimal) + this.x;
    }
    returnPlayerLocationY(decimal){
        return (1500 * decimal) + this.y;
    }

    drawOtherPlayers(players){
        fill(100, 200, 40);
        for(let i = 0; i < clientPlayer.index; i++){
            if(players[i] != null){
                let x = this.returnPlayerLocationX(players[i].decX);
                let y = this.returnPlayerLocationY(players[i].decY);
                circle(x, y, 50);

                players[i].gun.drawGun(x, y, players[i].angle);

                textSize(30);
                text("" + players[i].id, x - 9, y - 30);
            }
        }

        for(let i = clientPlayer.index + 1; i < players.length; i++){
            if(players[i] != null){
                let x = this.returnPlayerLocationX(players[i].decX);
                let y = this.returnPlayerLocationY(players[i].decY);
                circle(x, y, 50);

                players[i].gun.drawGun(x, y, players[i].angle);

                textSize(30);
                text("" + players[i].id, x - 9, y - 30);
            }
        }

    }

    drawBullets(bullets){
        bullets.forEach(element => {
            circle(element.x + this.x, element.y + this.y, 5);
        });
    }

    anyRectangleContains(xPos, yPos){
        for(var i = 0; i < this.coords.length; i++){
            if((xPos > (this.coords[i][0] + this.x) ) && (xPos < (this.coords[i][0] + this.x) + this.coords[i][2]) && (yPos > (this.coords[i][1] + this.y)) && (yPos < (this.coords[i][1] + this.y) + this.coords[i][3])){
                return true;
            }
        }

        /*
        for(var i = 0; i < this.doorCoords.length; i++){
            if((xPos > (this.doorCoords[i][0] + this.x) ) && (xPos < (this.doorCoords[i][0] + this.x) + this.doorCoords[i][2]) && (yPos > (this.doorCoords[i][1] + this.y)) && (yPos < (this.doorCoords[i][1] + this.y) + this.doorCoords[i][3])){
                return true;
            }
        }
        */
        return false;
        
    }

    cornerCollision(cornerX, cornerY, circleX, circleY, circleRad){
        if(collidePointCircle(cornerX, cornerY, circleX, circleY, circleRad * 2)){
            console.log(69);
            return true;
        }
        return false;
    }

    listCornerCollision(cornerList, circleX, circleY, circleRad){
        cornerList.forEach(element => {
            if(this.cornerCollision(element[0], element[1], circleX, circleY, circleRad)){
                return true;
            }
        });
        return false;
    }

}