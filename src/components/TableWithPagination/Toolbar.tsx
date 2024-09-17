import React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleSearch: any;
  searchValue: string;
  title?: string;
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, handleSearch, searchValue, title } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      {/* )} */}
      <TextField
        placeholder="Search"
        onChange={handleSearch}
        value={searchValue}
      />
      <Tooltip title="Clear filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
