import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import axiosInstance from '../../../axiosInstance';
import SpinnerLoader from '../../spinner/spinner';
import SelectField from '../../formhandle/SelectField';
import useForm from '../../formhandle/customValidation';
import TextFieldMU from '../../formhandle/TextField';

interface ActivityModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

export default function VillageModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [talukOptions, setTalukOptions] = React.useState([]);
  const [rolesOption, setRolesOption] = React.useState([]);
  const [hobliOptions, setHobliOptions] = React.useState([]);
  const [villageOptions, setVillageOptions] = React.useState([]);

  React.useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('getMasterDropDown', {
      ReqType: 1,
      Type: formData.Type
    });
    let tresponse = await axiosInstance.post('getMasterDropDown', {
      ReqType: 2,
      Type: formData.Type,
      UDCode: formData.DistrictCode,
    });
    let hresponse = await axiosInstance.post('getMasterDropDown', {
      ReqType: 3,
      Type: formData.Type,
      UDCode: formData.DistrictCode,
      UTCode: formData.TalukCode,
    });
    let vresponse = await axiosInstance.post('getMasterDropDown', {
      ReqType: 4,
      Type: formData.Type,
      UDCode: formData.DistrictCode,
      UTCode: formData.TalukCode,
      UHCode: formData.HobliCode,
    });
    let response = await axiosInstance.post('addOrGetRoles', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDistrictOptions(data.data);
      setTalukOptions(tresponse.data.data);
      setHobliOptions(hresponse.data.data);
      setVillageOptions(vresponse.data.data);
      setRolesOption(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  const initialValues: any = {
    DistrictCode: formData.DistrictCode,
    TalukCode: formData.TalukCode,
    HobliCode: formData.HobliCode,
    VillageCode: formData.VillageCode,
    RoleId: formData.RoleId,
    Name: formData.Name,
    Mobile: formData.Mobile,
    Type: formData.Type,
  };

  const validationSchema = {
    DistrictCode: {
      validate: (value: string) => {
        if (!value) {
          return 'DistricName is required';
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
          return 'HobliName is required';
        }
        return null;
      },
    },
    VillageCode: {
      validate: (value: string) => {
        if (!value) {
          return 'VillageName is required';
        }
        return null;
      },
    },
    RoleId: {
      validate: (value: string) => {
        if (!value) {
          return 'Role is required';
        }
        return null;
      },
    },
    Name: {
      validate: (value: string) => {
        if (!value) {
          return 'Name is required';
        }
        return null;
      },
    },
    Mobile: {
      validate: (value: string) => {
        if (!value) {
          return 'Mobile is required';
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
  };

  const onSubmit = (values: any) => {
    // Handle form submission logic, e.g., API call
    values.id = formData.id;
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

  return (
    <React.Fragment>
      <SpinnerLoader isLoading={loading} />
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="modal-modal-title" variant="h6" component="h2">
          Village Mapping
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <SelectField
                name="Type"
                label="Type"
                value={values.Type}
                onChange={handleChange}
                options={[
                  { value: 'Urban', name: 'Urban' },
                  { value: 'Rural', name: 'Rural' },
                ]}
                onBlur={handleBlur}
                error={touched.Type && Boolean(errors.Type)}
                helperText={touched.Type && errors.Type}
              />
              <SelectField
                name="DistrictCode"
                label="District Name"
                value={values.DistrictCode}
                onChange={handleChange}
                options={districtOptions}
                onBlur={handleBlur}
                error={touched.DistrictCode && Boolean(errors.DistrictCode)}
                helperText={touched.DistrictCode && errors.DistrictCode}
              />
              <SelectField
                name="TalukCode"
                label="Taluk Name"
                value={values.TalukCode}
                onChange={handleChange}
                options={talukOptions}
                onBlur={handleBlur}
                error={touched.TalukCode && Boolean(errors.TalukCode)}
                helperText={touched.TalukCode && errors.TalukCode}
              />
              <SelectField
                name="HobliCode"
                label="Hobli Name"
                value={values.HobliCode}
                onChange={handleChange}
                options={hobliOptions}
                onBlur={handleBlur}
                error={touched.HobliCode && Boolean(errors.HobliCode)}
                helperText={touched.HobliCode && errors.HobliCode}
              />
              <SelectField
                name="VillageCode"
                label="Village Name"
                value={values.VillageCode}
                onChange={handleChange}
                options={villageOptions}
                onBlur={handleBlur}
                error={touched.VillageCode && Boolean(errors.VillageCode)}
                helperText={touched.VillageCode && errors.VillageCode}
              />
              <SelectField
                name="RoleId"
                label="Role Name"
                value={values.RoleId}
                onChange={handleChange}
                options={rolesOption}
                onBlur={handleBlur}
                error={touched.RoleId && Boolean(errors.RoleId)}
                helperText={touched.RoleId && errors.RoleId}
              />
              <TextFieldMU
                name="Name"
                label="Name"
                value={values.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Name && Boolean(errors.Name)}
                helperText={touched.Name && errors.Name}
              />
              <TextFieldMU
                name="Mobile"
                label="Mobile"
                value={values.Mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Mobile && Boolean(errors.Mobile)}
                helperText={touched.Mobile && errors.Mobile}
              />
            </Box>
            <DialogActions>
              <Button
                onClick={handleClose}
                type="submit"
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
