class ClientPlayer{
//client side player class

    constructor(){
        this.x = windowWidth/2;
        this.y = windowHeight/2;
        this.radius = 50;
        this.angle = 0;
        this.number;
        this.index;

        this.topY = this.y - 28;
        this.leftX = this.x - 28;
        this.rightX = this.x + 28;
        this.bottomY = this.y + 28;
    }

    //draws green circle in middle of screen
    drawPlayer(){
        fill(0, 150, 0);
        circle(this.x, this.y, 50);
    }

    determineAngle(){
        //quad 1
        if(mouseX >= this.x && mouseY < this.y){
            this.angle = -1 *atan((this.y - mouseY)/(mouseX - this.x));
        }

        //quad 2
        if(mouseX > this.x && mouseY >= this.y){
            this.angle = atan((mouseY - this.y)/(mouseX - this.x));
        }

        //quad 3
        if(mouseX <= this.x && mouseY > this.y){
            this.angle = 3.14159 + atan((this.y - mouseY)/(abs(this.x - mouseX )));
        }

        //quad 4
        if(mouseX < this.x && mouseY <= this.y){
            this.angle = 3.14159 + atan((this.y - mouseY )/(abs(this.x-mouseX)));
        }

    }


    

}

