import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../axiosInstance';
import SectorsModal from '../../components/Modals/sectorsModal';

const headCells = [
  {
    id: 'SectorName',
    numeric: false,
    disablePadding: true,
    label: 'Sector Name',
  },
  {
    id: 'DepartmentName',
    numeric: false,
    disablePadding: true,
    label: 'Department Name',
  },
  {
    id: 'ParentName',
    numeric: false,
    disablePadding: true,
    label: 'Parent Activity',
  },
  {
    id: 'Action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];
interface Data {
  SchemeName: string;
  DepartmentName: string;
  ParentScheme: string;
}

export default function Sectors() {
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClickModify = (data: Data) => {
    setOpenModal(true);
    setFormData(data);
  };

  const handleClickAdd = () => {
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('/addOrGetSectors', { ReqType: 'Get' });
    if (data?.code == 200) {
      setTableData(data.data);
      setCopyTableData(data.data);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };
  useEffect(() => {
    fecthIntialData();
  }, []);

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    values['ReqType'] = 'Add';
    let { data } = await axiosInstance.post('/addOrGetSectors', values);
    if (data.code == 200) {
      await fecthIntialData();
      setOpenModal(false);
    } else {
      setOpenModal(false);
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  const renderDeoartModal = openModal && (
    <SectorsModal
      open={openModal}
      formData={formData}
      handleClose={() => setOpenModal(false)}
      handleSubmitForm={handleSubmitForm}
    />
  );

  return (
    <Box sx={{ padding: 2 }}>
      {renderDeoartModal}
      <Grid
        item
        md={12}
        xs={12}
        sx={{ display: 'flex', justifyContent: 'end' }}
      >
        <Button
          variant="outlined"
          onClick={handleClickAdd}
          startIcon={<DeleteIcon />}
        >
          Add New
        </Button>
      </Grid>
      <EnhancedTableData
        handleClickModify={handleClickModify}
        rows={copyTableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title='Sectors'
      />
    </Box>
  );
}
