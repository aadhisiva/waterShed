import React, { ChangeEvent, useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UploadIcon from '@mui/icons-material/Upload';
import axiosInstance from '../../axiosInstance';
import SchemesModal from '../../components/Modals/schemesModal';
import SpinnerLoader from '../../components/spinner/spinner';
import TableWithPagination from '../../components/TableWithPagination';

const headCells = [
  {
    id: 'MWS Code',
    numeric: false,
    disablePadding: true,
    label: 'MWS Code',
  },
  {
    id: 'MWS Name',
    numeric: false,
    disablePadding: true,
    label: 'MWS Name',
  },
  {
    id: 'Village',
    numeric: false,
    disablePadding: true,
    label: 'Village',
  },
  {
    id: 'Survey No',
    numeric: false,
    disablePadding: true,
    label: 'Survey No',
  },
  {
    id: 'Identification / Ownership',
    numeric: false,
    disablePadding: true,
    label: 'Identification/Ownership',
  },
  {
    id: 'Activity type (SWC/HORTI FORT/DLT)',
    numeric: false,
    disablePadding: true,
    label: 'Activity Type',
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

export default function DprsCommon() {
  const [totalCount, setTotalCount] = useState(0);

  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClickModify = (data: Data) => {
    setOpenModal(true);
    setFormData(data);
  };

  const fecthIntialData = async () => {
    try {
      setLoading(true);
      let { data } = await axiosInstance.post('getDprsLand', {
        DataType: 'Common',
        Page: page + 1,
        RowsPerPage: rowsPerPage,
      });
      if (data?.code == 200) {
        setTotalCount(data.data?.total);
        setTableData(data.data?.totalData);
        setCopyTableData(data.data?.totalData);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data.message || 'please try again');
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fecthIntialData();
  }, [rowsPerPage, page]);

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    values['ReqType'] = 'Add';
    let { data } = await axiosInstance.post('addOrGetschemes', values);
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
    <SchemesModal
      open={openModal}
      formData={formData}
      handleClose={() => setOpenModal(false)}
      handleSubmitForm={handleSubmitForm}
    />
  );

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return alert('No file selected');
    }
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const { data } = await axiosInstance.post('/uploadCommonLand', formData);
      if (data.code == 200) {
        await fecthIntialData();
        alert('Data uploaded successfully');
      } else {
        return alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <SpinnerLoader isLoading={loading} />
      {renderDeoartModal}
      <Grid
        item
        md={12}
        xs={12}
        sx={{ display: 'flex', justifyContent: 'end' }}
      >
        <Button
          variant="outlined"
          // onClick={handleClickAdd}
          startIcon={<UploadIcon />}
        >
          Uplod XLSX{' '}
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        </Button>
      </Grid>
      <TableWithPagination
        handleClickModify={handleClickModify}
        rows={copyTableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title="Dpr's Common Land"
        totalCount={Number(totalCount)}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </Box>
  );
}
