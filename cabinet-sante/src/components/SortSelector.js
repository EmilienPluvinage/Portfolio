import "../styles/styles.css";
import styled from "styled-components";
import { ArrowDownCircle, ArrowUpCircle } from "tabler-icons-react";

const Sort = styled.span`
  color: ${(props) => props.selected && "lightgray"};
  &:hover {
    cursor: pointer;
    color: lightgray;
  }
`;

const Container = styled.span`
  position: relative;
  top: 3px;
  margin-left: 5px;
  display: inline-block;
`;
export default function SortSelector({ field, sort, setSort }) {
  return (
    <>
      <Container>
        <Sort selected={field === sort.field && sort.direction === "down"}>
          <ArrowDownCircle
            onClick={() => setSort({ field: field, direction: "down" })}
            size={18}
          />
        </Sort>
        <Sort selected={field === sort.field && sort.direction === "up"}>
          <ArrowUpCircle
            onClick={() => setSort({ field: field, direction: "up" })}
            size={18}
          />
        </Sort>
      </Container>
    </>
  );
}
