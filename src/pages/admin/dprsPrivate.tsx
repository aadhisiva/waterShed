import React, { ChangeEvent, useEffect, useState } from 'react';
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
    id: 'Hobli',
    numeric: false,
    disablePadding: true,
    label: 'Hobli Name',
  },
  {
    id: 'Village',
    numeric: false,
    disablePadding: true,
    label: 'Village Name',
  },
  {
    id: 'Owner Name',
    numeric: false,
    disablePadding: true,
    label: 'Owner Scheme',
  },
  {
    id: 'Fruit ID',
    numeric: false,
    disablePadding: true,
    label: 'FruitId',
  },
  {
    id: 'Survey hissa',
    numeric: false,
    disablePadding: true,
    label: 'SurveyHissa',
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

interface CSVData {
  [key: string]: string | number;
}

interface ExcelData {
  [key: string]: string | number;
}


export default function DprsPrivate() {
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
    setLoading(true);
    let { data } = await axiosInstance.post('getDprsLand', { DataType: 'Private', Page: page + 1, RowsPerPage: rowsPerPage });
    if (data?.code == 200) {
      setTotalCount(data.data?.total);
      setTableData(data.data?.totalData);
      setCopyTableData(data.data?.totalData);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };
  useEffect(() => {
    fecthIntialData();
  }, [rowsPerPage, page]);

  const handleSubmitForm = async (values: any) => {
    setLoading(true);
    values['DataType'] = 'Private';
    let { data } = await axiosInstance.post('getDprsPrivateLand', values);
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
      console.error('No file selected');
      return;
    };
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const {data} = await axiosInstance.post("/uploadPrivateLand", formData);
      if (data.code == 200) {
        await fecthIntialData();
        alert('Data uploaded successfully');
      } else {
        return alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

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
          // onClick={handleClickAdd}
          startIcon={<UploadIcon />}
        >
          Uplod XLSX {" "}
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        </Button>
      </Grid>
      <TableWithPagination
        handleClickModify={handleClickModify}
        rows={copyTableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title="Dpr's Private Land"
        totalCount={Number(totalCount)}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </Box>
  );
}
