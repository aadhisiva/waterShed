import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../../components/spinner/spinner';
import QuestionMappingModal from '../../components/Modals/questionMappingModal';
import EditQuestionMappingModal from '../../components/Modals/editQuestionMappingModal';

const headCells = [
  {
    id: 'ActivityName',
    numeric: false,
    disablePadding: true,
    label: 'Activity Name',
  },
  {
    id: 'Question',
    numeric: false,
    disablePadding: true,
    label: 'Question Mapped',
  },
  {
    id: 'QuestionType',
    numeric: false,
    disablePadding: true,
    label: 'Question Mapped',
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

export default function ActivityQuestion() {
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [editOpenModal, setEditOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClickModify = (data: Data) => {
    setEditOpenModal(true);
    setFormData(data);
  };

  const handleClickAdd = () => {
    setFormData({});
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('mapQuestionOrUpdate', { ReqType: 'Get' });
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
    let { data } = await axiosInstance.post('mapQuestionOrUpdate', {ReqType: 'Add', MappedData: values});
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

  const handleSubmitEditFormData = async (values: any) => {
    setLoading(true);
    values["ReqType"] = "Edit";
    let { data } = await axiosInstance.post('mapQuestionOrUpdate', values);
    if (data.code == 200) {
      await fecthIntialData();
      setEditOpenModal(false);
      setLoading(false);
    } else {
        setEditOpenModal(false);
      setLoading(false);
      alert(data.message || 'please try again');
    };
  };

  const renderModal = openModal && (
    <QuestionMappingModal
      open={openModal}
      formData={formData}
      handleClose={() => setOpenModal(false)}
      handleSubmitForm={handleSubmitForm}
    />
  );

  const renderEditModal = editOpenModal && (
    <EditQuestionMappingModal
      open={editOpenModal}
      formData={formData}
      handleClose={() => setEditOpenModal(false)}
      handleSubmitForm={handleSubmitEditFormData}
    />
  );

  return (
    <Box sx={{ padding: 2 }}>
      {renderModal}
      {renderEditModal}
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
