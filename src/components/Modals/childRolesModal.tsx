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
import { decryptData } from '../../utils/decrypt';

interface ChildRolesModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function ChildRolesModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ChildRolesModalProps) {
  const [departmentOptions, setDepartmentOptions] = React.useState([]);
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const initialValues = {
    RoleId: formData.RoleId,
    ChildId: formData.ChildId,
  };

  const validationSchema = {
    RoleId: {
      validate: (value: string) => {
        if (!value) {
          return 'RoleName is required';
        }
        return null;
      },
    },
    ChildId: {
      validate: (value: string) => {
        if (!value) {
          return 'Child Name is required';
        }
        return null;
      },
    },
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
    let { data } = await axiosInstance.post('addOrGetRoles', { ReqType: 'Dd' });
    let decrypt = decryptData(data.data);
    if (data?.code == 200) {
      setRoleOptions(decrypt);
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
              <SelectField
                name="RoleId"
                label="Role Name"
                value={values.RoleId}
                onChange={handleChange}
                options={roleOptions}
                onBlur={handleBlur}
                error={touched.RoleId && Boolean(errors.RoleId)}
                helperText={touched.RoleId && errors.RoleId}
              />
              <SelectField
                name="ChildId"
                label="Child Name"
                value={values.ChildId}
                onChange={handleChange}
                options={roleOptions}
                onBlur={handleBlur}
                error={touched.ChildId && Boolean(errors.ChildId)}
                helperText={touched.ChildId && errors.ChildId}
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
