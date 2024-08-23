import { Box, Button, Container, Grid } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SelectField from '../formhandle/SelectField';
import useForm from '../formhandle/customValidation';
import axiosInstance from '../../axiosInstance';

interface SelectDistrictProps {
  handleSubmitForm: any;
}

export default function SelectHobli({ handleSubmitForm }: SelectDistrictProps) {
  const [loading, setLoading] = useState(false);
  const [districtDropdown, setDistrictDropdown] = useState([]);
  const [talukDropdown, setTalukDropdown] = useState([]);
  const [hobliDropdown, setHobliDropdown] = useState([]);
  const initialValues: any = {
    DistrictCode: '',
    TalukCode: '',
    HobliCode: '',
  };

  useEffect(() => {
    intiateIntialRequest();
  }, []);

  const intiateIntialRequest = async () => {
    let { data } = await axiosInstance.post('getMasterDropDown', {
      ReqType: 1,
    });
    if (data?.code == 200) {
      setDistrictDropdown(data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
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

  const handleTalukDropDown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    let { data } = await axiosInstance.post('getMasterDropDown', {
      ReqType: 2,
      UDCode: e.target.value,
    });
    setTalukDropdown(data.data);
    setLoading(true);
    handleChange(e);
  };

  const handleHobliDropDown = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    let { data } = await axiosInstance.post('getMasterDropDown', {
      ReqType: 2,
      UDCode: values.DistrictCode,
      UTCode: e.target.value,
    });
    setHobliDropdown(data.data);
    setLoading(true);
    handleChange(e);
  };

  return (
    <Container
      sx={{
        border: '1px solid',
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
              onChange={handleChange}
              options={hobliDropdown}
              onBlur={handleBlur}
              error={touched.HobliCode && Boolean(errors.HobliCode)}
              helperText={touched.HobliCode && errors.HobliCode}
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
