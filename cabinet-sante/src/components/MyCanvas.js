import { Center, Button } from "@mantine/core";
import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";

export default class MyCanvas extends Component {
  state = {
    open: false,
    color: "#1098AD",
    width: 600,
    height: 400,
    brushRadius: 2,
    lazyRadius: 2,
    backgroundImg:
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Nepalese_Mhapuja_Mandala.jpg",
    imgs: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Nepalese_Mhapuja_Mandala.jpg",
      "https://i.imgur.com/a0CGGVC.jpg",
    ],
  };

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ open: false });
  }

  render() {
    return this.state.open === false ? (
      <Button onClick={() => this.open()}>Ajouter un schéma</Button>
    ) : (
      <>
        <Center>
          <CanvasDraw
            ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
            brushColor={this.state.color}
            brushRadius={this.state.brushRadius}
            lazyRadius={this.state.lazyRadius}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
          />
        </Center>
        <Center>
          <Button
            onClick={() => {
              this.saveableCanvas.eraseAll();
            }}
          >
            Erase
          </Button>
          <Button
            onClick={() => {
              console.log(this.saveableCanvas.getSaveData());
            }}
          >
            Save
          </Button>
          <Button onClick={() => this.close()}>Close</Button>
        </Center>
      </>
    );
  }
}
