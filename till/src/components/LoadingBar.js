import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  background-color: grey;
  display: flex;
  flex-direction: row;
  height: 5px;
  border-radius: 10px;
  overflow: hidden;
`;

const Color = styled.div`
  width: ${(props) => props.size}%;
  background: ${(props) => props.color};
`;
const Gray = styled.div`
  background-color: grey;
  flex: 1;
`;

function LoadingBar({ percentage, color }) {
  return (
    <Container>
      <Color color={color} size={percentage} />
      <Gray />
    </Container>
  );
}

LoadingBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string,
};

LoadingBar.defaultProps = {
  color: "GreenYellow",
};

export default LoadingBar;
