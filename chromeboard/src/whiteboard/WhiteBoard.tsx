import { Component} from 'react';
import './WhiteBoard.css'

type WhiteboardState = {
    showWriteSlider?: boolean;
    writeLineThickness?: number;
}

class WhiteBoard extends Component {
    canvas = {} as HTMLCanvasElement;
    ctx = {} as any; //CanvasRenderingContext2D
    coord = {x:0, y:0};
    paint = false;
    eraseFlag = false;
    minHeight = 350;
    maxHeight = 600;
    minWidth = 400;
    maxWidth = 800;    
    
    state: WhiteboardState = {
        showWriteSlider: true,
        writeLineThickness: 1.5
    }

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
        this.undo = this.undo.bind(this);
        this.appendCurrentCanvasState = this.appendCurrentCanvasState.bind(this);
    } 

    componentDidMount() {
        this.canvas = document.querySelector('.myCanvas') as HTMLCanvasElement;
        console.log("Canvas operational... " + this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.setUpTools();
        this.setUpListeners();
        this.resize();
    }

    setUpTools() {
        let self = this;

        chrome.storage.local.get('writeLineThickness', function(item) {
            if(item != undefined && item != null && item['writeLineThickness'] != null) {
                self.setState(state => ({writeLineThickness: item['writeLineThickness']})); 
            }
        });
    }

    setUpListeners() {
        var self = this;

        document.addEventListener("mousedown", this.start);
        document.addEventListener("mouseup", this.saveState);
        document.addEventListener("mouseup", this.stop);
        document.addEventListener("keydown", function(event) {
            if((event.metaKey || event.ctrlKey) && event.key == 'z') {
                self.undo();
            }
        });
        this.resize();
    }

    increaseCanvasSize() {
        if(this.ctx.canvas.width < this.maxWidth && this.ctx.canvas.height < this.maxHeight) {
            chrome.storage.local.set({'canvasWidth': this.ctx.canvas.width + 100});
            chrome.storage.local.set({'canvasHeight': this.ctx.canvas.height + 50});
            this.resize();
        }
    }
    
    decreaseCanvasSize() {
       if(this.ctx.canvas.width > this.minWidth && this.ctx.canvas.height > this.minHeight) {
            chrome.storage.local.set({'canvasWidth' : this.canvas.width - 100});
            chrome.storage.local.set({'canvasHeight' : this.canvas.height - 50});
            this.resize(); 
        }
    }

    resize() {
        let self = this;        
    
        chrome.storage.local.get('canvasWidth', function(item) {
            self.onGetCanvasWidth(item['canvasWidth'] == null ? self.minWidth : item['canvasWidth']);
        });
        
        chrome.storage.local.get('canvasHeight', function(item) {
            self.onGetCanvasHeight(item['canvasHeight'] == null ? self.minHeight : item['canvasHeight']);
        });

        chrome.storage.local.get('canvasState', function(item) {
            self.getCachedCanvas(item['canvasState']);
        });

    }

    getCachedCanvas(canvasStateArray: Array<String>) {
        if(canvasStateArray == null) return;
        this.drawNewCanvas(canvasStateArray[canvasStateArray.length-1]);
    }

    drawNewCanvas(item: any) {
        let self = this;
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
        } else {
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
        this.ctx.lineWidth = this.state.writeLineThickness; 
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
        let self = this;
        chrome.storage.local.get('canvasState', function(item) {
            self.appendCurrentCanvasState(item['canvasState']);
        });
    }

    appendCurrentCanvasState(item: Array<String>) {
        if(!item || item.length > 5) item = [];

        item.push(this.canvas.toDataURL());
        this.setLocalCanvasState(item);
    }

    undo() {
        var self = this;
        chrome.storage.local.get('canvasState', function(item) {
            self.popCanvasState(item['canvasState']);
        });
    }

    popCanvasState(item: any) {
      item.pop();
      this.setLocalCanvasState(item);
      this.resize()
    }

    setLocalCanvasState(item : Array<String>) {
        chrome.storage.local.set({'canvasState' : item}); 
    }

    sliderChange() {

    }

    render() { 
        const {showWriteSlider} = this.state;

        return <>
            <div className = "TaskBar">
                <button className="canvasButton" onClick={this.increaseCanvasSize}>+</button>
                <button className="canvasButton" onClick={this.decreaseCanvasSize}>-</button>
                <button className="canvasButton" onClick={this.turnOnErase}>E</button>
                <button className="canvasButton" onClick={this.turnOnWrite}>W</button>
                {showWriteSlider && <input type="range" min="1" max="100" value="10" onChange={this.sliderChange} />}
            </div> 
            <canvas className="myCanvas"></canvas>
        </>
            
    }
}

export default WhiteBoard;