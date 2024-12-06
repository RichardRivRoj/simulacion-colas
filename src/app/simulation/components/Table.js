'use client';

const renderTables = ({ numberOfTables }) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    tables.push(
      <div key={i} className="flex items-center justify-center text-center">
        <p className="text-[10px]">
          {i + 1}
        <img src="/table.svg" alt={`Table ${i + 1}`} className="w-16 h-auto"/>
        </p>
      </div>
    );
  }
  return tables;
};

export default renderTables;