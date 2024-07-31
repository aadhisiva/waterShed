import React, { ChangeEvent, useEffect, useState } from 'react';
import EnhancedTableData from '../../components/TableData';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UploadIcon from '@mui/icons-material/Upload';
import axiosInstance from '../../axiosInstance';
import SchemesModal from '../../components/Modals/schemesModal';
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import SpinnerLoader from '../../components/spinner/spinner';

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
  const [tableData, setTableData] = useState([]);
  const [copyTableData, setCopyTableData] = useState([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [csvData, setCsvData] = useState<ExcelData[]>();

  const handleClickModify = (data: Data) => {
    setOpenModal(true);
    setFormData(data);
  };

  const handleClickAdd = () => {
    setOpenModal(true);
  };
  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('getDprsLand', { DataType: 'Private' });
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

  // const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const text = reader.result;
  //     Papa.parse<CSVData>(text as string, {
  //       complete: (result) => {
  //         console.log("Res",result.data);
  //         // setCsvData(result.data);
  //       },
  //       header: true,
  //     });
  //   };
  //   reader.readAsText(file, 'UTF-8');
  // };

  // const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(worksheet);
  //     console.log("json", jsonData[0])
  //     let response = await axiosInstance.post('/uploadPrivateLand', {data: jsonData});
  //     console.log(response);
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

  // const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

  //     const convertedData = jsonData.map((row: any) => {
  //       const convertedRow: ExcelData = {};
  //       Object.keys(row).forEach((key) => {
  //         convertedRow[key] = String(row[key]);
  //       });
  //       return convertedRow;
  //     });

  //     const chunkSize = 100;
  //     for (let i = 0; i < jsonData.length; i += chunkSize) {
  //       const chunk = jsonData.slice(i, i + chunkSize);
  //       console.log("i",i)
  //       console.log("json", chunk)
  //       let response = await axiosInstance.post('/uploadPrivateLand', {data: chunk});
  
  //     }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

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
      <EnhancedTableData
        handleClickModify={handleClickModify}
        rows={copyTableData}
        headCells={headCells}
        setCopyTableData={setCopyTableData}
        title="Dpr's Private Land"
      />
    </Box>
  );
}
