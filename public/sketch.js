var socket;

function setup(){
    //socket = io.connect('http://localhost:3000');
    socket = io.connect('http://localhost:8080');
    connectedUsersData = [];
    currentBullets = [];

    guns = [
        new Pistol(0,0)
    ]

    socket.on('setPlayerNum', function(playerNum){
        clientPlayer.number = playerNum.num;
        clientPlayer.index = playerNum.index;
    });

    socket.on('updateIndex', function(indexData){
        console.log(indexData.index);
        if(clientPlayer.number == indexData.number){
            clientPlayer.index = indexData.index;
        }
    });

    socket.on('playerData', function(connectedUsers){
        connectedUsersData = connectedUsers;
        for(var i = 0; i < connectedUsersData.length; i++){
            connectedUsersData[i].gun = guns[connectedUsers[i].gun];
        }
    });

    socket.on('bulletsData', function(bullets){
        currentBullets = bullets;
    });
    
    //partner window

    clientPlayer = new ClientPlayer();
    clientMap = new ClientGameMap(0, 0);
    currentGun = new Pistol(clientPlayer.x, clientPlayer.y);


    this.data = {
        winW: windowWidth,
        winL: windowHeight,
        decX: clientMap.decimalPlayerLocationX(),
        decY: clientMap.decimalPlayerLocationY(),
    }
    socket.emit('start', this.data);
    
    createCanvas(windowWidth, windowHeight);

    
    
    
}

function draw(){
    background(150);
    
    
    clientMap.move()
    clientMap.drawMap();
    clientPlayer.drawPlayer();
    clientPlayer.determineAngle();
    currentGun.drawGun(clientPlayer.x, clientPlayer.y, clientPlayer.angle);
    currentGun.shoot();

    textSize(30);
    text("" + clientPlayer.number, clientPlayer.x - 9, clientPlayer.y - 30);

    sendDrawData();
    //shooting
    //clientGun.shoot();
    
}

function setPartnerDimensions(window){
    this.partnerWindowW = window.w;
    this.partnerWindowH = window.h;
    console.log(this.partnerWindowW);
}

function sendDrawData(){
    let data = {
        index: clientMap.moveData.index,
        decX: clientMap.moveData.decX, 
        decY: clientMap.moveData.decY,
        angle: clientPlayer.angle
    }
    socket.emit('drawData', data);
    
}

function sendBulletData(){
    let bulletData = {
        startX: clientPlayer.x - clientMap.x + currentGun.bulletDisplacement*cos(clientPlayer.angle),
        startY: clientPlayer.y - clientMap.y + currentGun.bulletDisplacement*sin(clientPlayer.angle),
        damage: currentGun.damage,
        velocity: currentGun.bulletVelocity,
        angle: clientPlayer.angle,
    }
    socket.emit('bulletFired', bulletData);
}



