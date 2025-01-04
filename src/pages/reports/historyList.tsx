import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import axiosInstance from '../../axiosInstance';
import { PREVIEW_HISTORY } from '../../utils/routingPath';
import TableWithPagination from '../../components/TableWithPagination';
import SpinnerLoader from '../../components/spinner/spinner';
import SelectFieldsForHistory from './selectFieldsForHistory';

const headCells = [
  {
    id: 'DistrictName',
    numeric: false,
    disablePadding: true,
    label: 'Sv DistrictName',
  },
  {
    id: 'TalukName',
    numeric: false,
    disablePadding: true,
    label: 'Sv TalukName',
  },
  {
    id: 'HobliName',
    numeric: false,
    disablePadding: true,
    label: 'Sv HobliName',
  },
  {
    id: 'SubWatershedName',
    numeric: false,
    disablePadding: true,
    label: 'SubWatershed Name',
  },
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
    label: 'Activit Name',
  },
  {
    id: 'TypeOfLand',
    numeric: false,
    disablePadding: false,
    label: 'Type Of Land',
  },
  {
    id: 'ApplicationStatus',
    numeric: false,
    disablePadding: false,
    label: 'Application Status',
  },
  {
    id: 'StatusOfWork',
    numeric: false,
    disablePadding: false,
    label: 'StatusOfWork',
  },
  {
    id: 'CurrentLevel',
    numeric: false,
    disablePadding: false,
    label: 'Current Level',
  },
  {
    id: 'Action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];

export default function SearchReports() {
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyOforiginalData, setCopyOfOriginalData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(0);

  const [searchObject, setSearchObject] = useState<any>({});
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation(); // for fetching state data from previous page

  useEffect(() => {
    if (searching) {
      getDataFromApi();
    }
  }, [rowsPerPage, activePage, searching, searchObject]);

  const getDataFromApi = async () => {
    const {
      DistrictCode,
      TalukCode,
      SubWatershed,
      Sector,
      HobliCode,
      SurveyStatus,
      ApplicationStatus
    } = searchObject;

    console.log("searchObject", searchObject)

    setLoading(true);
    try {
      let { data } = await axiosInstance.post('fetchSearchReports', {
        DistrictCode: DistrictCode || null,
        TalukCode: TalukCode || null,
        HobliCode: HobliCode || null,
        SurveyStatus: SurveyStatus || null,
        ApplicationStatus: ApplicationStatus || null,
        ReportType: "History",
        PageNumber: activePage + 1,
        RowsPerPage: rowsPerPage
      });
      setOriginalData(data.data?.TotalData);
      setTotalCount(data.data?.TotalCount);
      setCopyOfOriginalData(data.data?.TotalData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const handleSearchResult = async (values: any) => {
    setSearchObject(values);
    // values.clearFilters();
    setSearching(true);
  };
  return (
    <Box sx={{ padding: 2 }}>
      <SpinnerLoader isLoading={loading} />
      <SelectFieldsForHistory handleSearchResult={handleSearchResult} />
      <Box sx={{ mt: 6 }}>
        <TableWithPagination
          handleClickModify={(obj: any) =>
            navigate(PREVIEW_HISTORY, { state: {...obj, ...{searchStatus : searchObject.ApplicationStatus} }})
          }
          rows={copyOforiginalData}
          originalData={originalData}
          headCells={headCells}
          setCopyTableData={setCopyOfOriginalData}
          title="Search Reports"
          totalCount={Number(totalCount)}
          page={activePage}
          isButtonType='Edit'
          setPage={setActivePage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
    </Box>
  );
}
