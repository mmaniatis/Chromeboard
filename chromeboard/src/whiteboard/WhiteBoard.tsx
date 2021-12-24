import React, { Component, useEffect} from 'react';
import './WhiteBoard.css'

class WhiteBoard extends Component {
    canvas = {} as HTMLCanvasElement;
    ctx = {} as any; //CanvasRenderingContext2D
    coord = {x:0, y:0};
    paint = false;
    eraseFlag = false;
    boardState = []
    stateIndex = 0;

    constructor(props: any) {
        super(props)
        
        //Bindings:
        this.start = this.start.bind(this);
        this.reposition = this.reposition.bind(this);
        this.draw = this.draw.bind(this);
        this.erase = this.erase.bind(this);
        this.turnOnErase= this.turnOnErase.bind(this);
        this.turnOnWrite= this.turnOnWrite.bind(this);
        this.stroke = this.stroke.bind(this);
        this.stop = this.stop.bind(this);
        this.resize = this.resize.bind(this);
        this.increaseCanvasSize = this.increaseCanvasSize.bind(this);
        this.decreaseCanvasSize = this.decreaseCanvasSize.bind(this);
        this.saveState = this.saveState.bind(this);
    } 

    componentDidMount() {
        this.canvas = document.querySelector('.myCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        document.addEventListener("mousedown", this.start);
        document.addEventListener("mouseup", this.saveState);
        document.addEventListener("mouseup", this.stop);
    
        this.resize();
    }

    componentWillUnmount() {
    }

    increaseCanvasSize(event: any) {
        if(this.ctx.canvas.width < 800 && this.ctx.canvas.height < 600) {
            chrome.storage.sync.set({'canvasWidth': this.ctx.canvas.width + 100});
            chrome.storage.sync.set({'canvasHeight': this.ctx.canvas.height + 50});
            this.resize();
        }
    }
    
    decreaseCanvasSize(event: any) {
       if(this.ctx.canvas.width > 400 && this.ctx.canvas.height > 350) {
            chrome.storage.sync.set({'canvasWidth' : this.canvas.width - 100});
            chrome.storage.sync.set({'canvasHeight' : this.canvas.height - 50});
            this.resize(); 
        }
        
    }

    resize() {
        let self = this;        
        chrome.storage.sync.get('canvasWidth', function(item) {
            self.onGetCanvasWidth(item['canvasWidth'] == null ? 400 : item['canvasWidth']);
        });
        
        chrome.storage.sync.get('canvasHeight', function(item) {
            self.onGetCanvasHeight(item['canvasHeight'] == null ? 350 : item['canvasHeight']);
        });

        chrome.storage.sync.get('canvasState', function(item) {
            self.onGetCanvasState(item['canvasState']);
        });
    }

    onGetCanvasState(item: any) {
        let self = this;
        console.log("Inside onGetCanvasState");
        console.log("Item: " + item);
        if(item == null) return;

        let image = new Image();
        image.src = item;
        image.onload = function () {
            self.ctx.drawImage(image, 0, 0);
        }
    }

    onGetCanvasWidth(item:any) {
        this.ctx.canvas.width = item;
    }

    onGetCanvasHeight(item:any) {
        this.ctx.canvas.height = item;
    }

    start(event: any) {
        if(this.eraseFlag) {
            document.addEventListener("mousemove", this.erase);
            this.reposition(event);
            this.erase(event);
        }
        else {
            document.addEventListener("mousemove", this.draw);
            this.reposition(event);
            this.draw(event);
        }
    }

    stop() {
        document.removeEventListener("mousemove", this.draw);
        document.removeEventListener("mousemove", this.erase);
    }
    
    reposition(event: any):void {
        this.coord.x = event.clientX - this.canvas.offsetLeft;
        this.coord.y = event.clientY - this.canvas.offsetTop;
    }

    draw(event: any) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = "round";
        this.stroke(event) 
    }

    erase(event:any) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 40;
        this.ctx.lineCap = "round";
        this.stroke(event);
    }

    stroke(event: any) {
        this.ctx.moveTo(this.coord.x, this.coord.y);
        this.reposition(event);
        this.ctx.lineTo(this.coord.x, this.coord.y);
        this.ctx.stroke();
    }

    turnOnErase() {
        this.eraseFlag = true;
    } 

    turnOnWrite() {
        this.eraseFlag = false;
    }

    saveState() {
        console.log("Inside saveState...");
        chrome.storage.sync.set({'canvasState' : this.canvas.toDataURL()}); 
    }

    render() { 
        return <>
            <div className = "TaskBar">
                <button className="canvasButton" onClick={this.increaseCanvasSize}>+</button>
                <button className="canvasButton" onClick={this.decreaseCanvasSize}>-</button>
                <button className="canvasButton" onClick={this.turnOnErase}>E</button>
                <button className="canvasButton" onClick={this.turnOnWrite}>W</button>
            </div> 
            <canvas className="myCanvas">
            </canvas>
        </>
            
    }
}

export default WhiteBoard;