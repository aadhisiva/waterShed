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
const [sectorOptions, setSectorOptions] = React.useState<any>([]);
const [loading, setLoading] = React.useState(false);

  const initialValues = {
    ActivityName: formData.ActivityName,
    ParentId: formData.ParentId,
    DepartmentId: formData.DepartmentId,
    SectorId: formData.SectorId,
    TypeOfLand: formData.TypeOfLand,
    TypeOfWork: formData.TypeOfWork,
    TypeOfStatus: formData.TypeOfStatus,
  };

  const validationSchema = {
    ActivityName: {
      validate: (value: string) => {
        if (!value) {
          return 'ActivityName is required';
        }
        return nameValid(value);
      },
    },
    TypeOfLand: {
      validate: (value: string) => {
        if (!value) {
          return 'TypeOfLand is required';
        }
        return null;
      },
    },
    TypeOfWork: {
      validate: (value: string) => {
        if (!value) {
          return 'TypeOfLand is required';
        }
        return null;
      },
    },
    TypeOfStatus: {
      validate: (value: string) => {
        if (!value) {
          return 'TypeOfStatus is required';
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
    SectorId: {
      validate: (value: string) => {
        if (!value) {
          return 'SectorName is required';
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
    let { data } = await axiosInstance.post('departments', { ReqType: 'Dd' });
    let response = await axiosInstance.post('addOrGetsActivity', { ReqType: 'Dd' });
    let sectorsRes = await axiosInstance.post('addOrGetSectors', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setSectorOptions(sectorsRes.data.data);
      setActivityOption([...response.data.data, ...[{value: -1, name: "NoParent"}]]);
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
                name="TypeOfLand"
                label="TypeOfLand"
                value={values.TypeOfLand}
                onChange={handleChange}
                options={[{value: "Private Land", name: "Private Land"},{value: "Common Land", name: "Common Land"}]}
                onBlur={handleBlur}
                error={touched.TypeOfLand && Boolean(errors.TypeOfLand)}
                helperText={touched.TypeOfLand && errors.TypeOfLand}
              />
                <SelectField
                name="TypeOfWork"
                label="TypeOfWork"
                value={values.TypeOfWork}
                onChange={handleChange}
                options={[{value: "Pysical Work", name: "Pysical Work"},{value: "Distribution Work", name: "Distribution Work"}]}
                onBlur={handleBlur}
                error={touched.TypeOfWork && Boolean(errors.TypeOfWork)}
                helperText={touched.TypeOfWork && errors.TypeOfWork}
              />
                <SelectField
                name="TypeOfStatus"
                label="TypeOfStatus"
                value={values.TypeOfStatus}
                onChange={handleChange}
                options={[{value: "Individual", name: "Individual"},{value: "Community", name: "Community"}]}
                onBlur={handleBlur}
                error={touched.TypeOfStatus && Boolean(errors.TypeOfStatus)}
                helperText={touched.TypeOfStatus && errors.TypeOfStatus}
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
                name="SectorId"
                label="Sector Name"
                value={values.SectorId}
                onChange={handleChange}
                options={sectorOptions}
                onBlur={handleBlur}
                error={touched.SectorId && Boolean(errors.SectorId)}
                helperText={touched.SectorId && errors.SectorId}
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
