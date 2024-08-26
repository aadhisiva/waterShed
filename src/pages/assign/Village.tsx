import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Box from '@mui/material/Box';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../../components/spinner/spinner';
import SelectVillage from '../../components/assignment/selectVillage';
import VillageModal from '../../components/Modals/assignment/villageModal';

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
    id: 'TalukName',
    numeric: false,
    disablePadding: true,
    label: 'Taluk Name',
  },
  {
    id: 'VillageName',
    numeric: false,
    disablePadding: true,
    label: 'Village Name',
  },
  {
    id: 'VillageNameKA',
    numeric: false,
    disablePadding: true,
    label: 'Village Name Ka',
  },
  {
    id: 'Type',
    numeric: false,
    disablePadding: true,
    label: 'Type',
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

export default function AssignVillage() {
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

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
      ReqType: 4,
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
    values['ListType'] = 'Village';
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
    <VillageModal
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
      <SelectVillage handleSubmitForm={handleClickAdd} />
      <Box sx={{ mt: 6 }}>
        <EnhancedTableData
          handleClickModify={handleClickModify}
          rows={copyTableData}
          headCells={headCells}
          setCopyTableData={setCopyTableData}
          title="Assign Village"
        />
      </Box>
    </Box>
  );
}
