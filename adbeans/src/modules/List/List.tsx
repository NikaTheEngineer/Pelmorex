import {
  Box, Card, CircularProgress, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';

import { IAnimal } from './list.api';
import useList from './useList';

const keys: (keyof IAnimal)[] = [
  'image_link',
  'name',
  'latin_name',
  'animal_type',
  'habitat',
  'diet',
  'geo_range',
];

const columnNames: {
  [key: string]: string;
} = {
  image_link: 'Image',
  name: 'Name',
  latin_name: 'Scientific Name',
  animal_type: 'Type',
  diet: 'Diet',
  size: 'Size',
  habitat: 'Habitat',
  geo_range: 'Geographic Range',
};

const List = () => {
  const {
    filteredList,
    loading,
    resetState,
    filterList,
    sortList,
    getRandomAnimals,
  } = useList();
  const [sort, setSort] = useState(keys[1]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getRandomAnimals();

    return () => {
      resetState();
    };
  }, []);

  useEffect(() => {
    sortList(sort);
  }, [filteredList, sort]);

  useEffect(() => {
    filterList(filter);
  }, [filter]);

  if (loading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fragment>
      <Card
        sx={{
          width: '80%',
          margin: '16px',
          mx: 'auto',
          p: '8px',
          display: 'flex',
        }}
      >
        <TextField
          fullWidth
          size="small"
          disabled={loading}
          label="Filter by name"
          type="text"
          sx={{
            mr: '8px',
          }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <TextField
          select
          fullWidth
          size="small"
          disabled={loading}
          label="Sort by"
          type="text"
          value={sort}
          onChange={e => {
            setSort(e.target.value as keyof IAnimal);
          }}
        >
          {keys.slice(1).map(key => (
            <MenuItem key={key} value={key}>
              {columnNames[key]}
            </MenuItem>
          ))}
        </TextField>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {keys.map(key => (
                <TableCell key={key}>{columnNames[key]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map(row => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box component="img" src={row.image_link} alt={row.name} width="80px" />
                </TableCell>
                {keys.slice(1).map(key => (
                  <TableCell key={key}>{row[key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default List;
