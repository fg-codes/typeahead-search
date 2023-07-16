import styled from "styled-components";
import { useState } from "react";

const MAX_RESULTS = 10;   // maximum of seatch suggestions
const MIN_LETTERS = 2;    // minumum of typed lettes before opening the suggestions

export const Typeahead = ({ books, categories }) => {
  const [value, setValue] = useState('');
  const [showValue, setShowValue] = useState(false)
  const [propose, setPropose] = useState([]);
  const [proposeIndex, setProposeIndex] = useState(0);

  const keyDown = (event) => {
    switch (event.key) {
      case "Enter": {             // If the user hasn't typed anything yet, or string doesn't match any strings
        propose.length !== 0 && propose.length !== books.length && (
          handleGo()
        )
        return;
      }
      case "ArrowUp": {
        event.preventDefault();
        proposeIndex > 0 && (setProposeIndex(proposeIndex - 1));   // "ArrowUp" is locked at min index 0
        return;
      }
      case "ArrowDown": {
        event.preventDefault();
        proposeIndex < propose.length - 1 && (setProposeIndex(proposeIndex + 1));  // "ArrowDown" at max suggestions length
        return;
      }
      case "Escape": {                    // On Escape, close the typeahead dropdown
        setPropose([]);
        return;
      }
    }
  }

  const userTyping = (event) => {                                     // as the user types, we filter the suggestions
    const { value } = event.target
    setValue(value);
    setShowValue(false)
    setPropose(books.filter((book) =>
      book.title.toLowerCase().includes(value.toLowerCase())
    ));
  }

  const handleGo = () => {
    setValue(propose[proposeIndex].title);
    setPropose([]);
    setShowValue(true);
    setProposeIndex(0);
  }

  const handleClear = () => {
    setValue('');
    setShowValue(false);
    setProposeIndex(0)
  }

  return (
    <Container>
      <InputDiv>
        <Input
          type="text"
          autoFocus
          onKeyDown={keyDown}
          onChange={userTyping}
          value={value}>
        </Input>
        <Button onClick={handleGo}>Enter</Button>
        <Btnclr onClick={handleClear}>Clear</Btnclr>
      </InputDiv>

      {value.length > MIN_LETTERS-1 && propose.length >= 1 && (
        <SuggestionsWrapper>
          {propose.map((book, index) => {
            return index < MAX_RESULTS &&
              <Item
                key={book.id}
                onClick={() => handleGo(book.title)}
                onMouseEnter={() => setProposeIndex(index)}
                focused={index === proposeIndex}>
                <span>
                  {book.title.slice(0, book.title.toLowerCase().indexOf(value.toLowerCase()) + value.length)}
                  <Prediction>
                    {book.title.slice(book.title.toLowerCase().indexOf(value.toLowerCase()) + value.length)}
                  </Prediction>
                  <i> in <Category> {categories[book.categoryId].name}</Category> </i>
                </span>
              </Item>
          })}
        </SuggestionsWrapper>
      )}
      {showValue && <ShowTitle>{value}</ShowTitle>}
    </Container>
  )
}

const Container = styled.div`
    margin: 10vh auto;
    max-width: 70vw;
`;

const InputDiv = styled.div`
    text-align: center;
    margin-bottom: 10px;
    height: fit-content;
    display: flex;
    wrap: no-wrap;
    gap: 10px
`;
const Input = styled.input`
    width: 100%;
    height: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid gray;
`;

const SuggestionsWrapper = styled.ul`
    padding: 10px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
`;

const Item = styled.li`
    padding: 9px;
    transition: all 200ms ease-in-out;
    cursor: pointer;
    background-color: ${props => props.focused ? "wheat" : "transparent"};
`;

const ShowTitle = styled.div`
  text-align: center;
  font-style: italic;
  margin-top: 5vh;
`;

const Button = styled.button`
    padding: 0 20px;
    color: white;
    background-color: royalblue;
    border-radius: 5px;
    border: 2px solid royalblue;
    transition: all 300ms ease;
    &:hover {
      color: royalblue;
      background-color: white;
      cursor: pointer;
    }
`;

const Btnclr = styled.button`
  padding: 0 18px;
  border: 2px solid royalblue;
  background-color: transparent;
  border-radius: 5px;
  color: royalblue;
  font-weight: 500;
  transition: all 300ms ease;
  &:hover {
    cursor: pointer;
    color: white;
    background-color: royalblue;
  }
`;

const Prediction = styled.span`
    font-weight: bold;
`;

const Category = styled.span`
    color: darkcyan;
`;