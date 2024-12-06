'use client';

const renderTables = ({ numberOfTables }) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    tables.push(
      <div key={i} className="flex items-center justify-center">
        <img src="/table.svg" alt={`Table ${i + 1}`} className="h-auto w-15"/>
      </div>
    );
  }
  return tables;
};

export default renderTables;