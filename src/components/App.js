import GlobalStyles from './GlobalStyles';

import data from "../data.js";
import { Typeahead } from './Typeahead';

export const App = () => {
  return (
    <>
      <GlobalStyles />
      <Typeahead books={data.books} categories={data.categories} />
    </>
  );
};
