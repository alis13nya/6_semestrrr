import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface TableProps {
  data: Record<string, any>[]; 
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  

  const headers = Object.keys(data[0]);

  const sortedData = [...data];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table className="table table-striped table-bordered mt-3">
      <thead className="table-light">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort(header)}
            >
              {header}{' '}
              {sortConfig?.key === header ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item, idx) => (
          <tr key={idx}>
            {headers.map((key) => (
              <td key={key}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
