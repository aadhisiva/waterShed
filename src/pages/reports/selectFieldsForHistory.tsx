import { Box, Button, Grid } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectField from '../../components/formhandle/SelectField';
import useDisptachForAction from '../../components/customHooks/useDis';
import useSelectorForUser from '../../components/customHooks/useSelectForUser';
import axiosInstance from '../../axiosInstance';
import { useLocation } from 'react-router-dom';
import {
  applicationStatusList,
  statusOfWorkList,
} from '../../utils/constants';

interface SelectFieldsForHistoryProps {
  handleSearchResult: any;
}
export default function SelectFieldsForHistory({
  handleSearchResult,
}: SelectFieldsForHistoryProps) {
  const [selectedItems, setSelectItems] = useState({
    DistrictCode: '',
    TalukCode: '',
    HobliCode: '',
    SubWatershed: '',
    Sector: '',
    SurveyStatus: '',
    ApplicationStatus: ''
  });

  const [districtDropDown, setDistrictDropDown] = useState([]);
  const [talukDropDown, setTalukDropDown] = useState([]);
  const [gpDropDown, setGpDropDown] = useState([]);

  const [loading, setLoading] = useState(false);

  const [dispatch] = useDisptachForAction();
  const [{ RoleAccess, Mobile }] = useSelectorForUser();

  const { state } = useLocation();

  const {
    DistrictCode,
    TalukCode,
    HobliCode,
    SurveyStatus,
    ApplicationStatus
  } = selectedItems;

  let assignReqType =
    RoleAccess.District == 'Yes'
      ? ''
      : RoleAccess.Taluk == 'Yes'
        ? 'District'
        : RoleAccess.Hobli == 'Yes'
          ? 'Taluk'
          : '';

  let districtAccess = RoleAccess.District == 'Yes';
  let talukAccess = RoleAccess.Taluk == 'Yes';
  let hobliAccess = RoleAccess.Hobli == 'Yes';

  const getDistricts = async () => {
    try {
      setLoading(true);
      let { data } = await axiosInstance.post('getMasterDropdown', {
        ReqType: 1,
        loginType: assignReqType == 'Taluk' ? 'District' : assignReqType,
        ListType: assignReqType,
        Mobile: Mobile,
        Type: '',
      });
      setDistrictDropDown(data?.data);
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
        SurveyStatus: '',
        ApplicationStatus: '',
      }));
      let { data } = await axiosInstance.post('getMasterDropdown', {
        ReqType: 2,
        UDCode: value,
        loginType: assignReqType,
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
        SurveyStatus: '',
        ApplicationStatus: '',
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
        SurveyStatus: '',
        ApplicationStatus: '',
      }));
    }
  };

  const handleStatusOfWorkSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    if (SurveyStatus !== value) {
      setSelectItems((prev) => ({
        ...prev,
        [name]: value,
        ApplicationStatus: '',
      }));
    }
  };

  const handleApplicationStatusSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    if (ApplicationStatus !== value) {
      setSelectItems((prev) => ({
        ...prev,
        [name]: value,
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
      ApplicationStatus: ''
    }));
  };

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
            name="SurveyStatus"
            label="StatusOfWork"
            value={SurveyStatus}
            onChange={handleStatusOfWorkSelect}
            options={statusOfWorkList}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <SelectField
            name="ApplicationStatus"
            label="Application Status"
            value={ApplicationStatus}
            onChange={handleApplicationStatusSelect}
            options={applicationStatusList}
          />
        </Grid>
        <Grid item md={3} sm={6}>
          <Button
            type="button"
            variant="contained"
            onClick={() =>{
              if(!SurveyStatus && !ApplicationStatus) return alert("Provide Status and applicationStatus"); 
              if(districtAccess){
                if(!dispatch) return alert("Provide District");
              };
              if(talukAccess){
                if(!DistrictCode && !TalukCode) return alert("Provide District and Taluk");
              };
              if(hobliAccess){
                if(!DistrictCode && !TalukCode && !HobliCode) return alert("Provide District and Taluk and Hobli");
              };
              handleSearchResult({
                ...selectedItems,
                ...{ clearFilters: handleClearFilters },
              })
            }}
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
