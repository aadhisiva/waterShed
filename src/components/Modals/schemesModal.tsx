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

interface SchemesModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function SchemesModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: SchemesModalProps) {
const [departmentOptions, setDepartmentOptions] = React.useState([]);
const [schemeOption, setSchemeOption] = React.useState<any>([]);
const [loading, setLoading] = React.useState(false);

  const initialValues = {
    SchemeName: formData.SchemeName,
    Description: formData.Description,
    SchemeLogo: formData.SchemeLogo,
    ParentId: formData.ParentId,
    DepartmentId: formData.DepartmentId,
  };

  const validationSchema = {
    SchemeName: {
      validate: (value: string) => {
        if (!value) {
          return 'DepartmentName is required';
        }
        return null;
      },
    },
    Description: {
      validate: (value: string) => {
        if (!value) {
          return 'Description is required';
        }
        return null;
      },
    },
    SchemeLogo: {
      validate: (value: string) => {
        if (!value) {
          return 'SchemeLogo is required';
        }
        return null;
      },
    },
    ParentId: {
      validate: (value: string) => {
        if (!value) {
          return 'Parent Scheme Name is required';
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
    let response = await axiosInstance.post('/addOrGetschemes', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setSchemeOption([...response.data.data, ...[{value: -1, name: "NoParent"}]]);
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
                name="SchemeName"
                label="Scheme Name"
                value={values.SchemeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.SchemeName && Boolean(errors.SchemeName)}
                helperText={touched.SchemeName && errors.SchemeName}
              />
              <TextFieldMU
                name="Description"
                label="Description"
                value={values.Description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Description && Boolean(errors.Description)}
                helperText={touched.Description && errors.Description}
              />
              <TextFieldMU
                name="SchemeLogo"
                label="SchemeLogo"
                value={values.SchemeLogo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.SchemeLogo && Boolean(errors.SchemeLogo)}
                helperText={touched.SchemeLogo && errors.SchemeLogo}
              />
              <SelectField
                name="ParentId"
                label="Parent Name"
                value={values.ParentId}
                onChange={handleChange}
                options={schemeOption}
                onBlur={handleBlur}
                error={touched.ParentId && Boolean(errors.ParentId)}
                helperText={touched.ParentId && errors.ParentId}
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