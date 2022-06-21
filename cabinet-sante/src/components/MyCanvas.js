import { Center, Button, Modal, ColorInput } from "@mantine/core";
import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";

export default class MyCanvas extends Component {
  state = {
    open: false,
    color: "#15aabf",
    width: 1000,
    height: 500,
    brushRadius: 2,
    lazyRadius: 2,
  };

  save() {
    this.props.setDrawing(this.saveableCanvas.getSaveData());
    this.setState({ open: false });
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ open: false });
  }

  changeColor(color) {
    this.setState({ color: color });
  }

  render() {
    return this.state.open === false ? (
      this.props.drawing === "" ||
      JSON.parse(this.props.drawing)?.lines?.length === 0 ? (
        <Button onClick={() => this.open()}>Ajouter</Button>
      ) : (
        <>
          <Button onClick={() => this.open()}>Modifier</Button>
          <Button onClick={() => this.props.setDrawing("")}>Supprimer</Button>
        </>
      )
    ) : (
      <>
        <Modal
          centered
          overlayOpacity={0.3}
          opened={this.open}
          onClose={() => this.close()}
          title={"Schéma"}
          closeOnClickOutside={false}
          size="95%"
        >
          <Center>
            <CanvasDraw
              ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
              brushColor={this.state.color}
              brushRadius={this.state.brushRadius}
              lazyRadius={this.state.lazyRadius}
              canvasWidth={this.state.width}
              canvasHeight={this.state.height}
              saveData={this.props.drawing}
              immediateLoading={true}
              imgSrc="https://emilienpluvinage.com/CabinetSante/img/canvas.jpg"
            />
          </Center>
          <Center>
            <Button
              style={{ margin: "10px" }}
              onClick={() => {
                this.saveableCanvas.eraseAll();
              }}
            >
              Effacer
            </Button>
            <Button style={{ margin: "10px" }} onClick={() => this.save()}>
              Sauvegarder
            </Button>
            <Button style={{ margin: "10px" }} onClick={() => this.close()}>
              Annuler
            </Button>
            <ColorInput
              style={{ margin: "10px" }}
              placeholder="Choix de la couleur"
              value={this.state.color}
              onChange={(event) => this.changeColor(event)}
              disallowInput
              withPicker={false}
              format="hex"
              swatchesPerRow={14}
              swatches={[
                "#25262b",
                "#868e96",
                "#fa5252",
                "#e64980",
                "#be4bdb",
                "#7950f2",
                "#4c6ef5",
                "#228be6",
                "#15aabf",
                "#12b886",
                "#40c057",
                "#82c91e",
                "#fab005",
                "#fd7e14",
              ]}
            />
          </Center>
        </Modal>
      </>
    );
  }
}
