import { Box, Button, Grid } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectField from '../../components/formhandle/SelectField';
import useDisptachForAction from '../../components/customHooks/useDis';
import useSelectorForUser from '../../components/customHooks/useSelectForUser';
import axiosInstance from '../../axiosInstance';
import { useLocation } from 'react-router-dom';
import { COMPLETED, ON_GOING_PROCESS, SITE_SELECTION } from '../../utils/constants';

interface SelectReportFieldsProps {
  handleSearchResult: any;
}
export default function SelectReportFields({
  handleSearchResult,
}: SelectReportFieldsProps) {
  const [selectedItems, setSelectItems] = useState({
    DistrictCode: '',
    TalukCode: '',
    HobliCode: '',
    SubWatershed: '',
    Sector: '',
    SurveyStatus: '',
  });

  const [districtDropDown, setDistrictDropDown] = useState([]);
  const [talukDropDown, setTalukDropDown] = useState([]);
  const [gpDropDown, setGpDropDown] = useState([]);
  const [subWatershedList, setSubWatershedDropDown] = useState([]);
  const [sectorsList, setSectorsDropDown] = useState([]);

  const [loading, setLoading] = useState(false);

  const [dispatch] = useDisptachForAction();
  const [{ RoleAccess, Mobile }] = useSelectorForUser();

  const {state} = useLocation();
  console.log("state",state)

  const {
    DistrictCode,
    TalukCode,
    SubWatershed,
    Sector,
    HobliCode,
    SurveyStatus,
  } = selectedItems;

  let assignReqType =
    RoleAccess.District == 'Yes'
      ? ''
      : RoleAccess.Taluk == 'Yes'
        ? 'District'
        : RoleAccess.Gp == 'Yes'
          ? 'Taluk'
          : '';

  const checkAdmin = RoleAccess.District == 'Yes';
  const checkDistrict = RoleAccess.Taluk == 'Yes';

  const getDistricts = async () => {
    try {
      setLoading(true);
      let { data } = await axiosInstance.post('getMasterDropdown', {
        ReqType: 1,
        loginType: checkAdmin ? '' : 'District',
        ListType: assignReqType,
        Mobile: Mobile,
        Type: '',
      });
      let response = await axiosInstance.post('getSectorsBySchemeId', {
        SchemeId: state?.id
      });
      setDistrictDropDown(data?.data);
      setSectorsDropDown(response.data?.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDistricts();
  }, []);

  const handleDistrictSelect = async (value: string) => {
    if (DistrictCode !== value) {
      setSelectItems((prev) => ({
        ...prev,
        DistrictCode: value,
        TalukCode: '',
        HobliCode: '',
        SubWatershed: '',
        Sector: '',
        SurveyStatus: '',
      }));
      let { data } = await axiosInstance.post('getMasterDropdown', {
        ReqType: 2,
        UDCode: value,
        loginType: checkDistrict ? '' : 'Taluk',
        ListType: assignReqType,
        Mobile: Mobile,
        Type: '',
      });
      setTalukDropDown(data.data);
    }
  };

  const handleTalukSelect = async (value: string) => {
    if (TalukCode !== value) {
      setSelectItems((prev) => ({
        ...prev,
        TalukCode: value,
        HobliCode: '',
        SubWatershed: '',
        Sector: '',
        SurveyStatus: '',
      }));
      let { data } = await axiosInstance.post('getMasterDropdown', {
        ReqType: 3,
        UTCode: value,
        UDCode: selectedItems.DistrictCode,
        Type: '',
      });
      setGpDropDown(data.data);
    }
  };

  const handleHobliSelect = async (value: string) => {
    if (HobliCode !== value) {
      setSelectItems((prev) => ({
        ...prev,
        HobliCode: value,
        SubWatershed: '',
        Sector: '',
        SurveyStatus: '',
      }));
      let { data } = await axiosInstance.post('getSubWatershed', {
        DistrictCode,
        TalukCode,
        HobliCode: value
      });
      setSubWatershedDropDown(data.data);
    }
  };

  const handleSubWatershedSelect = async (value: string) => {
    if (SubWatershed !== value) {
      setSelectItems((prev) => ({
        ...prev,
        SubWatershed: value,
        Sector: '',
        SurveyStatus: '',
      }));
    }
  };

  const handleClearFilters = () => {
    setSelectItems((prev) => ({
      ...prev,
      DistrictCode: '',
      TalukCode: '',
      HobliCode: '',
      SubWatershed: '',
      Sector: '',
      SurveyStatus: '',
    }));
  };
const statusOfWorkList = [
  {name: SITE_SELECTION, value: SITE_SELECTION},
  {name: ON_GOING_PROCESS, value: ON_GOING_PROCESS},
  {name: COMPLETED, value: COMPLETED}
]
  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid',
        borderRadius: '10px',
        padding: '10px', // Adjust padding as needed
        overflow: 'visible',
        '&::before': {
          content: '"Search Reports"', // Replace with your title text
          position: 'absolute',
          top: '-15px', // Adjust to place the title on the border
          left: '20px', // Adjust to align the title horizontally
          background: '#fff', // Background color to cover border
          padding: '0 10px', // Adjust padding to your preference
          fontWeight: 'bold',
        },
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ padding: 1, display: 'flex', alignItems: 'center' }}
      >
        <Grid item xs={6} sm={3}>
          <SelectField
            name="DistrictCode"
            label="District Name"
            value={DistrictCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleDistrictSelect(e.target.value)
            }
            options={districtDropDown}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="TalukCode"
            label="Taluk Name"
            value={TalukCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleTalukSelect(e.target.value)
            }
            options={talukDropDown}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="HobliCode"
            label="Hobli Name"
            value={HobliCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleHobliSelect(e.target.value)
            }
            options={gpDropDown}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="SubWatershed"
            label="Sub Watershed Name"
            value={SubWatershed}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSubWatershedSelect(e.target.value)
            }
            options={subWatershedList}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="Sector"
            label="Sector Name"
            value={Sector}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSelectItems({
                ...selectedItems,
                Sector: e.target.value
              })
            }
            options={sectorsList}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="SurveyStatus"
            label="StatusOfWork"
            value={SurveyStatus}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSelectItems({
                ...selectedItems,
                SurveyStatus: e.target.value
              })
            }
            options={statusOfWorkList}
          />
        </Grid>
        <Grid item md={3} sm={6}>
          <Button
            type="button"
            variant="contained"
            onClick={() => handleSearchResult(selectedItems)}
            color="primary"
          >
            Search Reports
          </Button>
        </Grid>
        <Grid item md={3} sm={6}>
          <Button
            type="button"
            variant="contained"
            onClick={handleClearFilters}
            color="secondary"
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
