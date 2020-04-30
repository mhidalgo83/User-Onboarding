import React from "react";
import "./App.css";
import Form from "./components/Form";
import styled from "styled-components";

const Wrapper = styled.div`
margin: 5% 0;
`

function App() {
  return (
    <Wrapper className="App">
      <Form />
    </Wrapper>
  );
}

export default App;
