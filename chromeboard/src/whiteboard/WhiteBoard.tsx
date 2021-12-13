import React, { Component, useEffect} from 'react';
import './WhiteBoard.css'

class WhiteBoard extends Component {
    canvas = {} as HTMLCanvasElement;
    ctx = {} as any; //CanvasRenderingContext2D
    coord = {x:0, y:0};
    paint = false;
    width = 400;
    height = 350;

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
        document.addEventListener("keyup", event => {
            if (event.code == "Space") {
                this.increase(event);
            }
        });
        document.addEventListener("mouseup", this.stop);
        // window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
    }

    increase(event: any) {
        if(this.width < 800 && this.height < 600) {
            this.width += 100;
            this.height += 50;
            this.resize();
        }
    }

    resize() {
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;
    }

    start(event: any) {
        document.addEventListener("mousemove", this.draw);
        this.reposition(event);
        this.draw(event);
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
        this.ctx.lineWidth = 1.5;
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