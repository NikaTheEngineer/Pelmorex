import { Box } from '@mui/material';
import { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header';
import List from './modules/List/List';

const App = () => (
  <Fragment>
    <Header />
    <Routes>
      <Route path="/list" element={<List />} />
      <Route path="/about" element={
        <Box>
          About Page
        </Box>
      } />
      <Route path="/*" element={<Navigate to="/list" />} />
    </Routes>
  </Fragment>
);

export default App;
