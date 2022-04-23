import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  width: fit-content;
  position: relative;
  top: 40px;
  right: 10px;
  margin-top: -30px;
`;

const Event = styled.div`
  height: 30px;
  width: 100px;
  border: 1px solid lightgray;
  border-radius: 3px;
  margin: 5px;
  padding-top: 10px;
  padding-right: 5px;
  padding-left: 5px;
  text-align: center;
  background-color: ${(props) => props.backgroundColor};
  color: white;
  font-weight: 600;
`;

export default function Caption({ appointmentTypes }) {
  return (
    <Container>
      {appointmentTypes.map((element) => (
        <Event key={element.id} backgroundColor={element.color}>
          {element.type}
        </Event>
      ))}
    </Container>
  );
}
