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

interface ActivityModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function ActivityModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
const [departmentOptions, setDepartmentOptions] = React.useState([]);
const [activityOption, setActivityOption] = React.useState<any>([]);
const [loading, setLoading] = React.useState(false);

  const initialValues = {
    ActivityName: formData.ActivityName,
    ParentId: formData.ParentId,
    DepartmentId: formData.DepartmentId,
  };

  const validationSchema = {
    ActivityName: {
      validate: (value: string) => {
        if (!value) {
          return 'ActivityName is required';
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
    let response = await axiosInstance.post('/addOrGetsActivity', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setActivityOption([...response.data.data, ...[{value: -1, name: "NoParent"}]]);
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
                name="ActivityName"
                label="Activity Name"
                value={values.ActivityName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.ActivityName && Boolean(errors.ActivityName)}
                helperText={touched.ActivityName && errors.ActivityName}
              />
              <SelectField
                name="ParentId"
                label="Parent Name"
                value={values.ParentId}
                onChange={handleChange}
                options={activityOption}
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
