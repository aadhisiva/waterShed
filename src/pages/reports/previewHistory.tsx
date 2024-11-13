import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Grid} from '@mui/material';


import axiosInstance from '../../axiosInstance';
import { PREVIEW_DETAILS } from '../../utils/routingPath';
import BorderWithTitle from '../../components/common/borderWithTitle';
import InputMultiline from '../../components/common/textarea';
import TableWithPagination from '../../components/TableWithPagination';
import useSelectorForUser from '../../components/customHooks/useSelectForUser';
import SpinnerLoader from '../../components/spinner/spinner';

const headCells = [
  {
    id: 'BeneficaryName',
    numeric: false,
    disablePadding: true,
    label: 'Beneficary Name',
  },
  {
    id: 'SchemeName',
    numeric: false,
    disablePadding: false,
    label: 'Scheme Name',
  },
  {
    id: 'SectorName',
    numeric: false,
    disablePadding: false,
    label: 'Sector Name',
  },
  {
    id: 'ActivityName',
    numeric: false,
    disablePadding: false,
    label: 'Activity Name',
  },
  {
    id: 'CreatedMobile',
    numeric: false,
    disablePadding: false,
    label: 'Created Mobile',
  },
  {
    id: 'CreatedRole',
    numeric: false,
    disablePadding: false,
    label: 'Created Role',
  },
  {
    id: 'ApplicationStatus',
    numeric: false,
    disablePadding: false,
    label: 'Application Status',
  },
  {
    id: 'Remarks',
    numeric: false,
    disablePadding: false,
    label: 'Remarks',
  },
  {
    id: 'History',
    numeric: false,
    disablePadding: false,
    label: 'History',
  },
  {
    id: 'StatusOfWork',
    numeric: false,
    disablePadding: false,
    label: 'StatusOfWork',
  },
  {
    id: 'Action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];

export default function PreviewHistory() {
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyOforiginalData, setCopyOfOriginalData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [Isupdate, setIsUpdate] = useState(false);

  const [remarks, setRemarks] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);

  const { SubmissionId, Status } = useLocation().state; // can fetch param id from url
  const [{ RoleName, Mobile, RoleId }] = useSelectorForUser(); // can get auth details from redux state

  const navigate = useNavigate(); // for switching page
  useEffect(() => {
    getDataFromApi();
  }, [rowsPerPage, activePage, Isupdate]);

  const getDataFromApi = async () => {
    try {
      setLoading(true);
      let { data } = await axiosInstance.post('fetchSearchReportsBySubId', {
        SubmissionId: SubmissionId,
        PageNumber: activePage + 1,
        RowsPerPage: rowsPerPage,
      });
      setOriginalData(data.data?.TotalData);
      setTotalCount(data.data?.TotalCount);
      setCopyOfOriginalData(data.data?.TotalData);
      setLoading(false);
      setIsUpdate(false);
    } catch (e) {
      setLoading(false);
    }
  }; // fetch data from api - LossDataBySubmissionId

  const handleRecord = async (status: string) => {
    let object = {
      SubmissionId: SubmissionId,
      Remarks: remarks,
      VerifiedRole: RoleName,
      VerifiedMobile: Mobile,
      ApplicationStatus: status,
      History: RoleName + ' changed to ' + status,
    };
    let { data } = await axiosInstance.post('updateStatusFromWeb', object);
    setIsUpdate(true);
    if (data.code == 200) return;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <SpinnerLoader isLoading={loading} />
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <Box sx={{ mt: 6 }}>
        <TableWithPagination
          handleClickModify={(obj: any) =>
            navigate(PREVIEW_DETAILS, { state: obj })
          }
          rows={copyOforiginalData}
          originalData={originalData}
          headCells={headCells}
          setCopyTableData={setCopyOfOriginalData}
          title="Application Chnages History"
          totalCount={Number(totalCount)}
          page={activePage}
          setPage={setActivePage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
      <BorderWithTitle title={'Add Comments to application'}>
        <Grid
          container
          spacing={2}
          sx={{ display: 'flex', alignItems: 'center', padding: 1 }}
        >
          <Grid item xs={12} sm={6}>
            <InputMultiline
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              type="button"
              variant="contained"
              color="info"
              disabled={!remarks ? true : false}
              onClick={() => handleRecord('Seek Clarification')}
            >
              Seek Clarification
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              type="button"
              variant="contained"
              color="warning"
              disabled={!remarks ? true : false}
              onClick={() => handleRecord('Rejected')}
            >
              Rejected
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              type="button"
              variant="contained"
              color="success"
              disabled={!remarks ? true : false}
              onClick={() => handleRecord('Approved')}
            >
              Approved
            </Button>
          </Grid>
        </Grid>
      </BorderWithTitle>
    </Box>
  );
}
