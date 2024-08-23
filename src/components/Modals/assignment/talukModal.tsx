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
};

export default function TalukModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [rolesOption, setRolesOption] = React.useState([]);

  React.useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('getMasterDropDown', {
        ReqType: 1,
      });
    let response = await axiosInstance.post('addOrGetRoles', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDistrictOptions(data.data);
      setRolesOption(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  const initialValues:any = {
    DistrictCode: formData.DistrictCode,
    RoleId: formData.RoleId,
    Name: formData.Name,
    Mobile: formData.Mobile
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
    }
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
          Mapping Questions
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
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
