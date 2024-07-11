// DataContext.tsx
import React, { createContext, useContext, useState } from 'react';

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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<props> = ({ children }) => {
  const [context, setContext] = useState<Data>({ data: [] });
  return (
    <DataContext.Provider value={{ context, setContext }}>
      {children}
    </DataContext.Provider>
  );
};

export function GetData(id: string): any {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context.context.data.find((element) => element.id === id)?.dataObject ?? null;
};

export function AddData(id: string, newData: any) {
  const context = useContext(DataContext);
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

export const RemoveData = (id: string) => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  context.setContext({ data: context.context.data.filter((element) => element.id !== id) });
  return context;
};
