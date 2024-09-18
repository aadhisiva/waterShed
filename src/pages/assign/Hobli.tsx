import React, { useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../axiosInstance';
import RolesModal from '../../components/Modals/rolesModal';
import SpinnerLoader from '../../components/spinner/spinner';
import SelectDistrict from '../../components/assignment/selectDistrict';
import DistrictModal from '../../components/Modals/assignment/districtModal';
import SelectTaluk from '../../components/assignment/selectTaluk';
import TalukModal from '../../components/Modals/assignment/talukModal';
import SelectHobli from '../../components/assignment/selectHobli';
import HobliModal from '../../components/Modals/assignment/hobliModal';
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
    id: 'HobliName',
    numeric: false,
    disablePadding: true,
    label: 'Hobli Name',
  },
  {
    id: 'HobliNameKA',
    numeric: false,
    disablePadding: true,
    label: 'Hobli Name Ka',
  },
  {
    id: 'RoleName',
    numeric: false,
    disablePadding: true,
    label: 'Mobile',
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

export default function AssignHobli() {
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
      ReqType: "Surveyer",
      DataType: "",
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
    values['ListType'] = 'Hobli';
    values['ReqType'] = 2;
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
    <HobliModal
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
      <SelectHobli handleSubmitForm={handleClickAdd} />
      <Box sx={{ mt: 6 }}>
        <EnhancedTableData
          handleClickModify={handleClickModify}
          rows={copyTableData}
          headCells={headCells}
          setCopyTableData={setCopyTableData}
          title="Assign Hobli"
        />
      </Box>
    </Box>
  );
}