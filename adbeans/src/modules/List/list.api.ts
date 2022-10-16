import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../services/axios';

export interface IAnimal {
  name: string;
  latin_name: string;
  animal_type: string;
  active_time: string;
  length_min: string;
  length_max: string;
  weight_min: string;
  weight_max: string;
  lifespan: string;
  habitat: string;
  diet: string;
  geo_range: string;
  image_link: string;
  id: number;
}

export const getRandomAnimals = createAsyncThunk(
  'getRandomAnimals',
  async () => {
    const response = await axios.get<never, IAnimal[]>('/animals/rand/10');

    return response;
  },
);
