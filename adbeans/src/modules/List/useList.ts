import { useDispatch, useSelector } from 'react-redux';

import { IAppDispatch } from '../../store';
import { getRandomAnimals, IAnimal } from './list.api';
import {
  filterList, resetState, selectList, sortList
} from './list.slice';

const useList = () => {
  const dispatch = useDispatch<IAppDispatch>();
  const listState = useSelector(selectList);

  return {
    ...listState,

    // actions
    resetState: () => dispatch(resetState()),
    filterList: (payload: string) => dispatch(filterList(payload)),
    sortList: (payload: keyof IAnimal) => dispatch(sortList(payload)),

    // api
    getRandomAnimals: () => dispatch(getRandomAnimals()),
  };
};

export default useList;
