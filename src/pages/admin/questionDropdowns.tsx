import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../axiosInstance';
import ActivityModal from '../../components/Modals/activityModal';
import SpinnerLoader from '../../components/spinner/spinner';
import QuestionDropdownTypeModal from '../../components/Modals/questionsDropdownModal';

const headCells = [
  {
    id: 'DropdownName',
    numeric: false,
    disablePadding: true,
    label: 'Dropdown Name',
  },
  {
    id: 'DropdownType',
    numeric: false,
    disablePadding: true,
    label: 'Dropdown Type',
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

export default function QuestionDropdowns() {
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClickModify = (data: Data) => {
    setOpenModal(true);
    console.log("Data", data);
    setFormData(data);
  };

  const handleClickAdd = () => {
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('addOrGetQuestionDropDownTypes', { ReqType: 'Get' });
    if (data?.code == 200) {
      setTableData(data.data);
      setCopyTableData(data.data);
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
    let { data } = await axiosInstance.post('addOrGetQuestionDropDownTypes', values);
    if (data.code == 200) {
      await fecthIntialData();
      setOpenModal(false);
      setLoading(false);
    } else {
      setOpenModal(false);
      setLoading(false);
      alert(data.message || 'please try again');
    };
  };

  const renderDeoartModal = openModal && (
    <QuestionDropdownTypeModal
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
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title='Question Dropdown List'
      />
    </Box>
  );
}
