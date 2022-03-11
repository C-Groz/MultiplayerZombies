var connectedUsers = [];
var bullets = [];
var userCounter = 0;

var mapData;
var count = 0;


function connectedUser(idNum, winL, winW, decX, decY, angle, gun, socketID){
    this.id = idNum; //counter 
    this.index = connectedUsers.length;
    this.winL = winL;
    this.winW = winW;
    this.decX = decX;
    this.decY = decY;
    this.angle = angle;
    this.socketID = socketID;
    this.gun = gun; //index of gun type in guns array in sketch
}

function Bullet(x, y, angle, damage, velocity, clientMapX, clientMapY){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.damage = damage;
    this.velocity = velocity;
}


var express = require('express');
var app = express();

const port = process.env.port || 3000;

var server = app.listen(port);
app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', 

    function(socket) {
        console.log('new connection: ' + socket.id);

        userCounter++;

        var playerNum = {num: userCounter, index: connectedUsers.length};
        socket.emit('setPlayerNum', playerNum);

        socket.on('start', function(data){
            //console.log(socket.id + " " + data.winL + " " + data.winW);
            connectedUsers.push(new connectedUser(userCounter, data.winL, data.winW, data.decX, data.decY, 0, 0, socket.id));
        });

        socket.on('drawData', 

        function(data){
            if(connectedUsers[data.index] != null){
                connectedUsers[data.index].decY = data.decY;
                connectedUsers[data.index].decX = data.decX;
                connectedUsers[data.index].angle = data.angle;
            }
            socket.broadcast.emit('playerData', connectedUsers);

            io.sockets.emit('bulletsData', bullets);
            updateBullets();
            
        });

        socket.on('bulletFired', 

        function(bulletData){
            if(bulletData.startX != null){
                bullets.push(new Bullet(bulletData.startX, bulletData.startY, bulletData.angle, bulletData.damage, bulletData.velocity));
                console.log("actual: " + bulletData.startX + " " +       bulletData.startY)
            }
        });

        socket.once('mapData', 

        function(mapCoords){
            mapData = mapCoords;
        });

        socket.on('disconnect', function(){
            console.log('new disconnection: ' + socket.id);
            let newUserList = [];
            let removeIndex;
            for(let i = 0; i < connectedUsers.length; i++){
                if(connectedUsers[i].socketID == socket.id){
                    removeIndex = i;
                    console.log(removeIndex);
                }
            }
            for(let i = 0; i < removeIndex; i++){
                newUserList.push(connectedUsers[i]);
            }
            for(let i = removeIndex + 1; i < connectedUsers.length; i++){
                newUserList.push(connectedUsers[i]);
                var indexData = {number: connectedUsers[i].number, index: connectedUsers[i].number - 1};
                socket.broadcast.emit('updateIndex', indexData);
            }
            connectedUsers = newUserList;
            
        });
    }
);

function updateBullets(){

    if(bullets.length != 0){
        for(var i = 0; i < bullets.length; i++){
            mapData.rectCoords.forEach(element => {
                if(bullets[i] != null){
                    if(rectangleContains(bullets[i].x, bullets[i].y, element[0], element[1], element[2], element[3])){
                        bullets.splice(i, 1);
                        console.log("bullet removed: " + i);
                    }
                }
            });
            if(bullets[i] != null){
                bullets[i].x += bullets[i].velocity * Math.cos(bullets[i].angle);
                bullets[i].y += bullets[i].velocity * Math.sin(bullets[i].angle);
            }
        }
    }
    
        /*
        if(bulletBoundaryCollison(bullets[i].x, bullets[i].y)){
            bullets.splice(i, 1);
            console.log("bullet removed: " + i);
        }else{
            bullets[i].x += bullets[i].velocity * Math.cos(bullets[i].angle);
            bullets[i].y += bullets[i].velocity * Math.sin(bullets[i].angle);
        }
        */
        
    
}

function bulletBoundaryCollison(bulletX, bulletY){
    mapData.rectCoords.forEach(element => {
        if(rectangleContains(bulletX, bulletY, element[0], element[1], element[2], element[3])){
            return true;
        }
        if(count <= 100){
            console.log(element[0] + " " + element[1] + " " + element[2] + " " + element[3]);
            console.log(bulletX + " " + bulletY);
            count++;
        }
        
    });
    return false;
}

function rectangleContains(x, y, rectX, rectY, rectL, rectW){
    if((x > rectX) && (x < rectX + rectL) && (y > rectY) && (y < rectY + rectW)){
        return true;
    }
    return false
}




