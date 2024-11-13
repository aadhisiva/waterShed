import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Box from '@mui/material/Box';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../../components/spinner/spinner';
import SelectTaluk from '../../components/assignment/selectTaluk';
import TalukModal from '../../components/Modals/assignment/talukModal';
import useSelectorForUser from '../../components/customHooks/useSelectForUser';

const headCells = [
  {
    id: 'DistrictName',
    numeric: false,
    disablePadding: true,
    label: 'District Name',
  },
  {
    id: 'TalukName',
    numeric: false,
    disablePadding: true,
    label: 'Taluk Name',
  },
  {
    id: 'TalukNameKA',
    numeric: false,
    disablePadding: true,
    label: 'Taluk Name Ka',
  },
  {
    id: 'RoleName',
    numeric: false,
    disablePadding: true,
    label: 'Role Name',
  },
  {
    id: 'Name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'Mobile',
    numeric: false,
    disablePadding: false,
    label: 'Mobile',
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

export default function AssignTaluk() {
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const [{Mobile}] = useSelectorForUser();
  
  const handleClickModify = (data: Data) => {
    setOpenModal(true);
    setFormData(data);
  };

  const handleClickAdd = (values: any) => {
    setFormData(values);
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('getAssignedMasters', {
      ReqType: "Taluk",
      DataType: "All",
      Mobile
    });
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
    values['ListType'] = 'Taluk';
    values['ReqType'] = 1;
    let { data } = await axiosInstance.post('assignmentProcess', values);
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
    <TalukModal
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
      <SelectTaluk handleSubmitForm={handleClickAdd} />
      <Box sx={{ mt: 6 }}>
        <EnhancedTableData
          handleClickModify={handleClickModify}
          rows={copyTableData}
          originalData={tableData}
          headCells={headCells}
          setCopyTableData={setCopyTableData}
          title="Assign Taluk"
        />
      </Box>
    </Box>
  );
}
