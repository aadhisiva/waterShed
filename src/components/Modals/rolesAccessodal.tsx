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

interface RolesModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function RoleAccessModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: RolesModalProps) {
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [departmentOptions, setDepartmentOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const initialValues = {
    RoleId: formData.RoleId,
    District: formData.District,
    Taluk: formData.Taluk,
    Hobli: formData.Hobli,
    Village: formData.Village,
    Type: formData.Type,
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
    District: {
      validate: (value: string) => {
        if (!value) {
          return 'District is required';
        }
        return null;
      },
    },
    Taluk: {
      validate: (value: string) => {
        if (!value) {
          return 'Taluk is required';
        }
        return null;
      },
    },
    Hobli: {
      validate: (value: string) => {
        if (!value) {
          return 'Hobli is required';
        }
        return null;
      },
    },
    Village: {
      validate: (value: string) => {
        if (!value) {
          return 'Hobli is required';
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
    let response = await axiosInstance.post('departments', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setRoleOptions(data.data);
      setDepartmentOptions(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };
const typeOptions = [{value: "Urban", name: "Urban"},{value: "Rural", name: "Rural"},{value: "Both", name: "Both"},{value: "Admin", name: "Admin"}]
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
          Adding/Modify Role Access
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
                name="District"
                label="District"
                value={values.District}
                onChange={handleChange}
                options={[{value: "Yes", name: "Yes"}, {value: "No", name: "No"}]}
                onBlur={handleBlur}
                error={touched.District && Boolean(errors.District)}
                helperText={touched.District && errors.District}
              />
              <SelectField
                name="Taluk"
                label="Taluk"
                value={values.Taluk}
                onChange={handleChange}
                options={[{value: "Yes", name: "Yes"}, {value: "No", name: "No"}]}
                onBlur={handleBlur}
                error={touched.Taluk && Boolean(errors.Taluk)}
                helperText={touched.Taluk && errors.Taluk}
              />
              <SelectField
                name="Hobli"
                label="Hobli"
                value={values.Hobli}
                onChange={handleChange}
                options={[{value: "Yes", name: "Yes"}, {value: "No", name: "No"}]}
                onBlur={handleBlur}
                error={touched.Hobli && Boolean(errors.Hobli)}
                helperText={touched.Hobli && errors.Hobli}
              />
              <SelectField
                name="Village"
                label="Village"
                value={values.Village}
                onChange={handleChange}
                options={[{value: "Yes", name: "Yes"}, {value: "No", name: "No"}]}
                onBlur={handleBlur}
                error={touched.Village && Boolean(errors.Village)}
                helperText={touched.Village && errors.Village}
              />
              <SelectField
                name="Type"
                label="Type"
                value={values.Type}
                onChange={handleChange}
                options={typeOptions}
                onBlur={handleBlur}
                error={touched.Type && Boolean(errors.Type)}
                helperText={touched.Type && errors.Type}
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
