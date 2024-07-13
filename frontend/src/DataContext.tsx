// DataContext.tsx
import React, { createContext, useState } from 'react';

interface props {
  children: React.ReactNode;
}

interface Data {
  data: {
    id: string;
    dataObject: any;
  }[];
}

interface DataContextType {
  context: Data;
  setContext: (data: Data) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<props> = ({ children }) => {
  const [context, setContext] = useState<Data>({ data: [] });
  return (
    <DataContext.Provider value={{ context, setContext }}>
      {children}
    </DataContext.Provider>
  );
};

/**
   * Gets a data object from the context that matches the ID.
   *
   * @param context - the data context. Use 'const context = useContext(DataContext);' at the top of the react component to get the context.
   * @param id - The ID of the data object
   * @returns The data object that matches the ID if it exists, null otherwise
   */
export function GetData(context: DataContextType | undefined, id: string): any {
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context.context.data.find((element) => element.id === id)?.dataObject ?? null;
};

/**
   * Sets a data object int the context with the set ID, or updates an existing data object that matches the ID.
   *
   * @param context - the data context. Use 'const context = useContext(DataContext);' at the top of the react component to get the context.
   * @param id - The ID of the data object
   * @param newData - The data object to set or update
   * @returns The data object that matches the ID if it exists, null otherwise
   */
export function AddData(context: DataContextType | undefined, id: string, newData: any) {
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  let existingData = context.context.data.find((element) => element.id === id);
  if (existingData !== undefined) {
    existingData.dataObject = newData;
    context.setContext({ data: [...context.context.data] });
  }
  else {
    context.setContext({ data: [...context.context.data, { id: id, dataObject: newData }] });
  }
};

/**
   * Deletes a data object from the context that matches the ID.
   *
   * @param context - the data context. Use 'const context = useContext(DataContext);' at the top of the react component to get the context.
   * @param id - The ID of the data object
   */
export const RemoveData = (context: DataContextType | undefined, id: string) => {
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  context.setContext({ data: context.context.data.filter((element) => element.id !== id) });
  return context;
};
