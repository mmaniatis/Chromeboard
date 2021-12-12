import React, { Component, useEffect} from 'react';
import './WhiteBoard.css'

class WhiteBoard extends Component {
    canvas = {} as HTMLCanvasElement;
    ctx = {} as any; //CanvasRenderingContext2D
    coord = {x:0, y:0};
    paint = false;

    constructor(props: any) {
        super(props)
        
        //Bindings:
        this.start = this.start.bind(this);
        this.reposition = this.reposition.bind(this);
        this.draw = this.draw.bind(this);
        this.stop = this.stop.bind(this);
        this.resize = this.resize.bind(this);
    } 

    componentDidMount() {
        this.canvas = document.querySelector('.myCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        document.addEventListener("mousedown", this.start);
        document.addEventListener("mouseup", this.stop);
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
    } 
    
    resize() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    }

    start(event: any) {
        document.addEventListener("mousemove", this.draw);
        this.reposition(event)
    }

    stop() {
        document.removeEventListener("mousemove", this.draw);
    }
    
    reposition(event: any):void {
        this.coord.x = event.clientX - this.canvas.offsetLeft;
        this.coord.y = event.clientY - this.canvas.offsetTop;
    }

    draw(event: any) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(this.coord.x, this.coord.y);
        this.reposition(event);
        this.ctx.lineTo(this.coord.x, this.coord.y);
        this.ctx.stroke();
    }

    render() { 
        return <canvas className="myCanvas">
                </canvas>
            
    }
}

export default WhiteBoard;