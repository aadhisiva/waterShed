import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Grid } from '@mui/material';

import axiosInstance from '../../axiosInstance';
import { PREVIEW_DETAILS } from '../../utils/routingPath';
import BorderWithTitle from '../../components/common/borderWithTitle';
import InputMultiline from '../../components/common/textarea';
import TableWithPagination from '../../components/TableWithPagination';
import useSelectorForUser from '../../components/customHooks/useSelectForUser';
import SpinnerLoader from '../../components/spinner/spinner';
import SelectField from '../../components/formhandle/SelectField';
import { statusOfWorkList, SURVEY_COMPLETED } from '../../utils/constants';
import { decryptData } from '../../utils/decrypt';

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
    id: 'VerifiedRole',
    numeric: false,
    disablePadding: false,
    label: 'VerifiedRole',
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
  const [childRolesData, setChildRolesData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [surveyStatus, setSurveyStatus] = useState('');
  const [appStatus, setAppStatus] = useState('');
  const [Isupdate, setIsUpdate] = useState(false);

  // const [Isupdate, setIsUpdate] = useState(false);

  const [remarks, setRemarks] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);

  const {
    SubmissionId,
    StatusOfWork,
    ApplicationStatus,
    searchStatus,
    CreatedRole,
  } = useLocation().state; // can fetch param id from url
  const [{ RoleName, Mobile, RoleId, RoleAccess }] = useSelectorForUser(); // can get auth details from redux state

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
      let res = await axiosInstance.post('assignChildAndGet', {
        ReqType: 'Get',
      });
      let decrypt = decryptData(res.data?.data);
      setChildRolesData(decrypt);
      setOriginalData(data?.data?.TotalData);
      setTotalCount(data?.data?.TotalCount);
      setCopyOfOriginalData(data?.data?.TotalData);
      setLoading(false);
      setIsUpdate(false);
    } catch (e) {
      setLoading(false);
    }
  }; // fetch data from api - LossDataBySubmissionId

  let loginRype =
    RoleAccess?.District == 'Yes' && RoleAccess?.Type == 'Admin'
      ? 'Super Admin'
      : RoleAccess?.District == 'Yes' && RoleAccess?.Type == 'Both'
        ? 'Admin'
        : RoleAccess?.Taluk == 'Yes'
          ? 'District'
          : RoleAccess?.Hobli == 'Yes'
            ? 'Taluk'
            : '';

  // let getChildId = childRolesData.find((obj: any) => obj.RoleId == RoleId)?.[
  //   'ChildId'
  // ];
  let cretedId: any = (childRolesData || []).find(
    (obj: any) => obj.ChildName == CreatedRole,
  );
  // let subChildId = childRolesData.find(
  //   (obj: any) => obj.RoleId == getChildId,
  // )?.['ChildId'];
const adminStatus = ApplicationStatus == 'Approved' &&
                  StatusOfWork == 'Completed';
  const handleApprove = async (status: string) => {
    let object: any = {
      SubmissionId: SubmissionId,
      Remarks: remarks,
      VerifiedRole: RoleName,
      VerifiedMobile: Mobile,
      ApplicationStatus: status,
      VerifiedId: RoleId,
      History: `${RoleName} officer - changed applicationStatus ${ApplicationStatus} to ${status}.`,
    };
    if (loginRype == 'Admin') {
      if (!surveyStatus) return alert('select surveyStatus');
      object.StatusOfWork = surveyStatus;
      object.ApplicationStatus = adminStatus ? appStatus : 'Pending';
      object.RoleId = RoleId;
      object.History = `${RoleName} officer - changed applicationStatus ${ApplicationStatus} to ${status} and StatusOfWork ${StatusOfWork} to ${surveyStatus}.`;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    } else if (loginRype == 'District') {
      object.RoleId = RoleId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    } else if (loginRype == 'Taluk') {
      object.RoleId = RoleId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    }
  };

  const handleReject = async (status: string) => {
    let object: any = {
      SubmissionId: SubmissionId,
      Remarks: remarks,
      VerifiedRole: RoleName,
      VerifiedMobile: Mobile,
      ApplicationStatus: status,
      VerifiedId: RoleId,
      History: `${RoleName} officer - changed applicationStatus ${ApplicationStatus} to ${status}.`,
    };
    if (loginRype == 'District') {
      object.RoleId = cretedId?.ChildId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    } else if (loginRype == 'Taluk') {
      object.RoleId = cretedId?.ChildId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    }
  };

  const handleSeekClarification = async (status: string) => {
    let object: any = {
      SubmissionId: SubmissionId,
      Remarks: remarks,
      VerifiedRole: RoleName,
      VerifiedMobile: Mobile,
      ApplicationStatus: status,
      VerifiedId: RoleId,
      History: `${RoleName} officer - changed applicationStatus ${ApplicationStatus} to ${status}`,
    };
    if (loginRype == 'District') {
      object.RoleId = cretedId?.ChildId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    } else if (loginRype == 'Taluk') {
      object.RoleId = cretedId?.ChildId;
      let { data } = await axiosInstance.post('updateStatusFromWeb', object);
      if (data.code == 200) setIsUpdate(true);
    }
  };
  let lastRecord: any = originalData
    .slice(originalData.length - 1)
    .find((obj: any) => obj.CurrentLevelId);

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
          isButtonType="View Application"
          totalCount={Number(totalCount)}
          page={activePage}
          setPage={setActivePage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
      {searchStatus ? (
        ''
      ) : lastRecord?.VerifiedRole !== RoleName ? (
        <BorderWithTitle title={'Add Comments to application'}>
          <Grid
            container
            spacing={2}
            sx={{ display: 'flex', alignItems: 'center', padding: 1 }}
          >
            <Grid item xs={12} sm={5}>
              <InputMultiline
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>
            {loginRype !== 'Admin' ? (
              <React.Fragment>
                <Grid item xs={6} sm={2}>
                  <Button
                    type="button"
                    variant="contained"
                    color="info"
                    disabled={!remarks ? true : false}
                    onClick={() =>
                      handleSeekClarification('Seek Clarification')
                    }
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
                    onClick={() => handleReject('Rejected')}
                  >
                    Rejected
                  </Button>
                </Grid>
              </React.Fragment>
            ) : (
              <>
                <Grid item xs={6} sm={3}>
                  <SelectField
                    name="surveyStatus"
                    label="StatusOfWork"
                    value={surveyStatus}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSurveyStatus(e.target.value)
                    }
                    disabled={!remarks ? true : false}
                    options={statusOfWorkList.slice(
                      statusOfWorkList.findIndex(
                        (obj) => obj.name == StatusOfWork,
                      ) + 1,
                      3,
                    )}
                  />
                </Grid>
                {ApplicationStatus == 'Completed' &&
                  StatusOfWork == 'Completed' && (
                    <Grid item xs={6} sm={3}>
                      <SelectField
                        name="appStatus"
                        label="Application Status"
                        value={appStatus}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSurveyStatus(e.target.value)
                        }
                        disabled={!remarks ? true : false}
                        options={[
                          {
                            name: SURVEY_COMPLETED,
                            value: SURVEY_COMPLETED,
                          },
                        ]}
                      />
                    </Grid>
                  )}
              </>
            )}
            <Grid item xs={6} sm={2}>
              <Button
                type="button"
                variant="contained"
                color="success"
                disabled={!remarks ? true : false}
                onClick={() => handleApprove('Approved')}
              >
                Approved
              </Button>
            </Grid>
          </Grid>
        </BorderWithTitle>
      ) : (
        ''
      )}
    </Box>
  );
}
