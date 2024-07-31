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
const [roleOption, setRoleOption] = React.useState<any>([]);
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
      validate: (value: File | null) => {
        if (!value) return 'SchemeLogo is required.';
        if (value.size > 10485760) return 'File size exceeds 10 MB.';
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(value.type)) return 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.';
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
    RoleId: {
      validate: (value: string) => {
        if (!value) {
          return 'RoleName is required';
        }
        return null;
      },
    },
  };
  const onSubmit = async (values: Values) => {
    // Handle form submission logic, e.g., API call
    setLoading(true);
    var fileFormData = new FormData()
    fileFormData.append('image', values.SchemeLogo);
    let {data} = await axiosInstance.post('uploadImage', fileFormData);
    setLoading(false);
    values.id = formData?.id;
    values.SchemeLogo = data.data.imageUrl;
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
    let response = await axiosInstance.post('addOrGetschemes', { ReqType: 'Dd' });
    let rolesRes = await axiosInstance.post('addOrGetRoles', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDepartmentOptions(data.data);
      setRoleOption(rolesRes.data.data);
      setSchemeOption([...response.data.data, ...[{value: -1, name: "NoParent"}]]);
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
              <ImageUploadMU
                name="SchemeLogo"
                // label="SchemeLogo"
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
              <SelectField
                name="RoleId"
                label="Role Name"
                value={values.RoleId}
                onChange={handleChange}
                options={roleOption}
                onBlur={handleBlur}
                error={touched.RoleId && Boolean(errors.RoleId)}
                helperText={touched.RoleId && errors.RoleId}
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
