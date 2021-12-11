import React, { Component } from 'react';
import './WhiteBoard.css'


class WhiteBoard extends Component {
    canvas = {} as HTMLCanvasElement;
    ctx = {} as any //CanvasRenderingContext2D

    draw(){
        this.ctx?.moveTo(0, 0);
        this.ctx?.lineTo(200, 100);
        this.ctx?.stroke();
    }

    componentDidMount() {
        this.canvas = document.querySelector('.myCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.draw()
    }

    render() { 
        return <div id="board">
            <canvas className="myCanvas">
            </canvas>
        </div>
    }
}

export default WhiteBoard;