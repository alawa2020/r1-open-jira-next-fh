import { FC, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { entriesApi } from '../../apis';

import { Entry } from '../../interfaces';

import { EntriesContext, entriesReducer } from './';

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

export const EntriesProvider: FC = ({ children }) => {
  // hooks
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  useEffect(() => {
    refreshData();
  }, [])

  // methods

  const addNewEntry = async(description: string) => {
    
    const { data } = await entriesApi.post<Entry>('/entries', { description});

    dispatch({ type: '[Entry] Add-Entry', payload: data });
  };

  const updateEntry = async(entry: Entry) => {
    const { data } = await entriesApi.put<Entry>( `/entries/${entry._id}`, entry )
    dispatch({ type: '[Entry] Entry-Updated', payload: data });
  };

  const refreshData = async () => {
    const { data } = await entriesApi.get<Entry[]>('/entries');
    dispatch({ type: '[Entry] Load data', payload: data });
  };

  return (
    <EntriesContext.Provider
      value={{
        ...state,

        // Methods
        addNewEntry,
        updateEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
