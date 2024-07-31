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
import ImageUploadMU from '../formhandle/ImageUpload';

interface SectorsModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function SectorsModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: SectorsModalProps) {
const [departmentOptions, setDepartmentOptions] = React.useState([]);
const [sectorOption, setSectorOption] = React.useState<any>([]);
const [schemeOptions, setSchemesOption] = React.useState<any>([]);
const [loading, setLoading] = React.useState(false);

  const initialValues = {
    SectorName: formData.SectorName,
    Description: formData.Description,
    SectorLogo: formData.SectorLogo,
    ParentId: formData.ParentId,
    DepartmentId: formData.DepartmentId,
    SchemeId: formData.SchemeId,
  };

  const validationSchema = {
    SectorName: {
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
    SectorLogo: {
      validate: (value: File | null) => {
        if (!value) return 'SectorLogo is required.';
        if (value.size > 10485760) return 'File size exceeds 10 MB.';
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(value.type)) return 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.';
        return null;
      },
    },
    ParentId: {
      validate: (value: string) => {
        if (!value) {
          return 'Parent Sector Name is required';
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
    SchemeId: {
      validate: (value: string) => {
        if (!value) {
          return 'Scheme Name is required';
        }
        return null;
      },
    },
  };
  const onSubmit = async (values: Values) => {
    // Handle form submission logic, e.g., API call
    setLoading(true);
    var fileFormData = new FormData()
    fileFormData.append('image', values.SectorLogo);
    let {data} = await axiosInstance.post('uploadImage', fileFormData);
    setLoading(false);
    values.id = formData?.id;
    values.SectorLogo = data.data.imageUrl;
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
    let response = await axiosInstance.post('addOrGetSectors', { ReqType: 'Dd' });
    let SchemesRes = await axiosInstance.post('addOrGetSchemes', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setSchemesOption(SchemesRes.data.data);
      setSectorOption([...response.data.data, ...[{value: -1, name: "NoParent"}]]);
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
                name="SectorName"
                label="Sector Name"
                value={values.SectorName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.SectorName && Boolean(errors.SectorName)}
                helperText={touched.SectorName && errors.SectorName}
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
               <ImageUploadMU
                name="SectorLogo"
                label="SchemeLogo"
                value={values.SectorLogo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.SectorLogo && Boolean(errors.SectorLogo)}
                helperText={touched.SectorLogo && errors.SectorLogo}
              />
              <SelectField
                name="ParentId"
                label="Parent Name"
                value={values.ParentId}
                onChange={handleChange}
                options={sectorOption}
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
              <SelectField
                name="SchemeId"
                label="Scheme Name"
                value={values.SchemeId}
                onChange={handleChange}
                options={schemeOptions}
                onBlur={handleBlur}
                error={touched.SchemeId && Boolean(errors.SchemeId)}
                helperText={touched.SchemeId && errors.SchemeId}
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
