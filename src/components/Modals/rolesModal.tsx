import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import useForm from '../formhandle/customValidation';
import TextFieldMU from '../formhandle/TextField';
import SelectField from '../formhandle/SelectField';
import axiosInstance from '../../axiosInstance';
import SpinnerLoader from '../spinner/spinner';
import { nameValid } from '../../utils/validations';

interface RolesModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function RolesModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: RolesModalProps) {
  const [departmentOptions, setDepartmentOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const initialValues = {
    RoleName: formData.RoleName,
    DepartmentId: formData.DepartmentId,
    IsMobile: formData.IsMobile,
  };

  const validationSchema = {
    RoleName: {
      validate: (value: string) => {
        if (!value) {
          return 'RoleName is required';
        }
        return nameValid(value);
      },
    },
    DepartmentId: {
      validate: (value: string) => {
        if (!value) {
          return 'DepartmentName is required';
        }
        return null;
      },
    },
    IsMobile: {
      validate: (value: string) => {
        if (!value) {
          return 'IsMobile is required';
        }
        return null;
      },
    }
  };
  const onSubmit = (values: Values) => {
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

  React.useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('departments', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

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
          Adding/Modify Roles
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <TextFieldMU
                name="RoleName"
                label="Role Name"
                value={values.RoleName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.RoleName && Boolean(errors.RoleName)}
                helperText={touched.RoleName && errors.RoleName}
              />
              <SelectField
                name="DepartmentId"
                label="Department Name"
                value={values.DepartmentId}
                onChange={handleChange}
                options={departmentOptions}
                onBlur={handleBlur}
                error={touched.DepartmentId && Boolean(errors.DepartmentId)}
                helperText={touched.DepartmentId && errors.DepartmentId}
              />
              <SelectField
                name="IsMobile"
                label="Is this Mobile role"
                value={values.IsMobile}
                onChange={handleChange}
                options={[{value: "Yes", name: "Yes"}, {value: "No", name: "No"}]}
                onBlur={handleBlur}
                error={touched.IsMobile && Boolean(errors.IsMobile)}
                helperText={touched.IsMobile && errors.IsMobile}
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
