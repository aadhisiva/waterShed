import React, { useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import DepartmentModal from '../../components/Modals/departmentModal';

const headCells = [
  {
    id: 'DepartmentName',
    numeric: false,
    disablePadding: true,
    label: 'Department Name',
  },
  {
    id: 'Action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];
interface Data {
  calories: string;
  carbs: string;
  fat: string;
  name: string;
  protein: string;
}
const rows = [
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
  {
    DepartmentName: 'DepartmentName 1',
  },
];
export default function Department() {
  const [tableData, setTableData] = useState(rows);
  const [copyTableData, setCopyTableData] = useState(rows);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const handleClickModify = (data: Data) => {
    // console.log('data', data);
  };

  const handleClickAdd = () => {
    setOpenModal(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
    {openModal && 
    <DepartmentModal open={openModal} handleClose={() => setOpenModal(false)} />}
      <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={handleClickAdd} startIcon={<DeleteIcon />}>
          Add New
        </Button>
      </Grid>
      <EnhancedTableData
        handleClickModify={handleClickModify}
        rows={copyTableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
      />
    </Box>
  );
}
