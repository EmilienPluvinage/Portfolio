import React from "react";
import { TwitterPicker } from "react-color";
import "../styles/colorPicker.css";

export default class ColorPicker extends React.Component {
  state = {
    background: this.props.initColor,
  };

  handleChangeComplete = (color, event) => {
    this.setState({ background: color.hex });
    this.props.callback(this.props.id, color.hex);
  };

  render() {
    return (
      <div className="color-picker">
        <TwitterPicker
          color={this.state.background}
          onChangeComplete={this.handleChangeComplete}
          triangle="hide"
        />
      </div>
    );
  }
}
