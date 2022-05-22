import "../styles/styles.css";
import styled from "styled-components";
import PatientsWarning from "./PatientsWarning";
import ReminderWarnings from "./ReminderWarnings";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  flex-wrap: wrap;
`;

export default function Home() {
  return (
    <Container>
      <PatientsWarning />
      <ReminderWarnings />
    </Container>
  );
}
