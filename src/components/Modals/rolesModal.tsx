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
    District: formData.District,
    Taluk: formData.Taluk,
    Hobli: formData.Hobli,
    Village: formData.Village,
    DepartmentId: formData.DepartmentId,
  };

  const validationSchema = {
    RoleName: {
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
    DepartmentId: {
      validate: (value: string) => {
        if (!value) {
          return 'DepartmentName is required';
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
    let { data } = await axiosInstance.post('/departments', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="modal-modal-title" variant="h6" component="h2">
          Adding/Modify Schemes
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
                name="DepartmentId"
                label="Department Name"
                value={values.DepartmentId}
                onChange={handleChange}
                options={departmentOptions}
                onBlur={handleBlur}
                error={touched.DepartmentId && Boolean(errors.DepartmentId)}
                helperText={touched.DepartmentId && errors.DepartmentId}
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
