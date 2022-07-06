import { createTheme, ThemeProvider } from '@mui/material';
import { materialControlElements } from '@react-querybuilder/material';
import QueryBuilder, { Field, formatQuery, RuleGroupType } from 'react-querybuilder';
import React, { useState } from 'react';

const muiTheme = createTheme();


export default function QuerySpecific() {
  const fields: Field[] = [
    { name: 'timestamp', label: 'Timestamp' },
    { name: 'PersonId', label: 'Person Id' },
    { name: 'type', label: 'Type of datapoint' },
    { name: 'X', label: 'X' },
    { name: 'Y', label: 'Y' }
  ];

  const [query, setQuery] = useState<RuleGroupType>({
    combinator: 'and',
    rules: []
  });
  return (
    <ThemeProvider theme={muiTheme}>
      <div>

        <div className='position-relative h-100 w-100'>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={q => setQuery(q)}
            controlElements={materialControlElements}
          />
        </div>
        
      </div>
    </ThemeProvider>
  );
}
// <code>{formatQuery(query, 'sql')}</code>
