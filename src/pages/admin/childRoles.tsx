import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../../components/spinner/spinner';
import ChildRolesModal from '../../components/Modals/childRolesModal';
import { decryptData } from '../../utils/decrypt';

const headCells = [
  {
    id: 'RoleName',
    numeric: false,
    disablePadding: true,
    label: 'Role Name',
  },
  {
    id: 'ChildName',
    numeric: false,
    disablePadding: true,
    label: 'Child Role',
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

export default function ChildRoles() {
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
    setFormData({});
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('assignChildAndGet', { ReqType: 'Get' });
    let decrypt = decryptData(data.data);
    if (data?.code == 200) {
      setTableData(decrypt);
      setCopyTableData(decrypt);
      setLoading(false);
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
    let { data } = await axiosInstance.post('assignChildAndGet', values);
    if (data.code == 200) {
      await fecthIntialData();
      setOpenModal(false);
      setLoading(false);
    } else {
      setOpenModal(false);
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  const renderDeoartModal = openModal && (
    <ChildRolesModal
      open={openModal}
      formData={formData}
      handleClose={() => setOpenModal(false)}
      handleSubmitForm={handleSubmitForm}
    />
  );

  return (
    <Box sx={{ padding: 2 }}>
      {renderDeoartModal}
      <SpinnerLoader isLoading={loading} />
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
        originalData={tableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title='Assign Child'
      />
    </Box>
  );
}
