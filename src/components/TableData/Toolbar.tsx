import React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
    numSelected: number;
    handleSearch: any;
    searchValue: string;
  }
  
export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, handleSearch, searchValue } = props;
  
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          // ...(numSelected > 0 && {
          //   bgcolor: (theme) =>
          //     alpha(
          //       theme.palette.primary.main,
          //       theme.palette.action.activatedOpacity,
          //     ),
          // }),
        }}
      >
        {/* {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : ( */}
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Departments
          </Typography>
        {/* )} */}
        <TextField  placeholder="Search" onChange={handleSearch} value={searchValue}/>
        <Tooltip title="Clear filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    );
  };
  