import { Box, Button, Container, Grid } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectField from '../formhandle/SelectField';
import useForm from '../formhandle/customValidation';
import axiosInstance from '../../axiosInstance';
import useSelectorForUser from '../customHooks/useSelectForUser';

interface SelectDistrictProps {
  handleSubmitForm: any;
}

export default function SelectVillage({
  handleSubmitForm,
}: SelectDistrictProps) {
  const [loading, setLoading] = useState(false);
  const [districtDropdown, setDistrictDropdown] = useState([]);
  const [talukDropdown, setTalukDropdown] = useState([]);
  const [hobliDropdown, setHobliDropdown] = useState([]);
  const [villageDropdown, setVillageDropdown] = useState([]);

  const [{Mobile}] = useSelectorForUser();

  const initialValues: any = {
    DistrictCode: '',
    TalukCode: '',
    HobliCode: '',
    VillageCode: '',
    Type: ''
  };

  const validationSchema = {
    DistrictCode: {
      validate: (value: string) => {
        if (!value) {
          return 'DistrictName is required';
        }
        return null;
      },
    },
    Type: {
      validate: (value: string) => {
        if (!value) {
          return 'Type is required';
        }
        return null;
      },
    },
    TalukCode: {
      validate: (value: string) => {
        if (!value) {
          return 'TalukName is required';
        }
        return null;
      },
    },
    HobliCode: {
      validate: (value: string) => {
        if (!value) {
          return 'Hobli is required';
        }
        return null;
      },
    },
    VillageCode: {
      validate: (value: string) => {
        if (!value) {
          return 'Village Name is required';
        }
        return null;
      },
    },
  };

  const onSubmit = (values: any) => {
    // Handle form submission logic, e.g., API call
    handleSubmitForm(values);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm({ initialValues, validationSchema, onSubmit });

  const handleClearFilter = () => {
    setValues({});
  };

  const handleDistictDropdown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setValues({
      ...values,
      Type: e.target.value, 
      DistrictCode: "",
      TalukCode: "",
      HobliCode: "",
      VillageCode: ""
    });
    let { data } = await axiosInstance.post("getMasterDropdown", { ReqType: 1, loginType: "District",ListType: "Hobli", Mobile, Type: e.target.value });
    setDistrictDropdown(data.data);
    setLoading(false);
  };


  const handleTalukDropDown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setValues({
      ...values,
      DistrictCode: e.target.value,
      TalukCode: "",
      HobliCode: "",
      VillageCode: ""
    });
    let { data } = await axiosInstance.post("getMasterDropdown", { ReqType: 2, UDCode: e.target.value, loginType: "Taluk",ListType: "Hobli", Mobile, Type: values.Type });
    setTalukDropdown(data.data);
    setLoading(true);
  };

  const handleHobliDropDown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setValues({
      ...values,
      TalukCode: e.target.value,
      HobliCode: "",
      VillageCode: ""
    });
    let { data } = await axiosInstance.post("getMasterDropdown", { ReqType: 3, UTCode: e.target.value, UDCode: values.DistrictId, loginType: "Hobli", ListType: "Hobli", Mobile, Type: values.Type })
    setHobliDropdown(data.data);
    setLoading(true);
  };

  const handleVillageDropDown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setValues({
      ...values,
      HobliCode: e.target.value,
      VillageCode: ""
    });
    let { data } = await axiosInstance.post('getMasterDropDown', {
      ReqType: 4,
      Type: values.Type,
      UDCode: values.DistrictCode,
      UTCode: values.TalukCode,
      UHCode: e.target.value,
    });
    setVillageDropdown(data.data);
    setLoading(true);
  };

  return (
    <Container
      sx={{
        position: 'relative',
        border: '1px solid',
        borderRadius: '10px',
        padding: '10px', // Adjust padding as needed
        overflow: 'visible',
        '&::before': {
          content: '"Assignment"', // Replace with your title text
          position: 'absolute',
          top: '-15px', // Adjust to place the title on the border
          left: '20px', // Adjust to align the title horizontally
          background: '#fff', // Background color to cover border
          padding: '0 10px', // Adjust padding to your preference
          fontWeight: 'bold',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* <span>lkyjftr</span> */}
        <Grid
          container
          spacing={2}
          sx={{ display: 'flex', alignItems: 'center', padding: 1 }}
        >
          <Grid item xs={6} sm={3}>
            <SelectField
              name="Type"
              label="Type"
              value={values.Type}
              onChange={handleDistictDropdown}
              options={[
                { value: 'Urban', name: 'Urban' },
                { value: 'Rural', name: 'Rural' },
              ]}
              onBlur={handleBlur}
              error={touched.Type && Boolean(errors.Type)}
              helperText={touched.Type && errors.Type}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectField
              name="DistrictCode"
              label="District Name"
              value={values.DistrictCode}
              onChange={handleTalukDropDown}
              options={districtDropdown}
              onBlur={handleBlur}
              error={touched.DistrictCode && Boolean(errors.DistrictCode)}
              helperText={touched.DistrictCode && errors.DistrictCode}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectField
              name="TalukCode"
              label="Taluk Name"
              value={values.TalukCode}
              onChange={handleHobliDropDown}
              options={talukDropdown}
              onBlur={handleBlur}
              error={touched.TalukCode && Boolean(errors.TalukCode)}
              helperText={touched.TalukCode && errors.TalukCode}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectField
              name="HobliCode"
              label="Hobli Name"
              value={values.HobliCode}
              onChange={handleVillageDropDown}
              options={hobliDropdown}
              onBlur={handleBlur}
              error={touched.HobliCode && Boolean(errors.HobliCode)}
              helperText={touched.HobliCode && errors.HobliCode}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectField
              name="VillageCode"
              label="Village Name"
              value={values.VillageCode}
              onChange={handleChange}
              options={villageDropdown}
              onBlur={handleBlur}
              error={touched.VillageCode && Boolean(errors.VillageCode)}
              helperText={touched.VillageCode && errors.VillageCode}
            />
          </Grid>
          <Grid item md={3} sm={6} sx={{ textAlign: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </Grid>
          <Grid item md={3} sm={6}>
            <Button
              type="button"
              variant="contained"
              onClick={handleClearFilter}
              color="primary"
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}