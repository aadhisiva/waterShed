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

interface DepartmentModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
    [key: string]: string;
  };
  
export default function DepartmentModal({
  open,
  handleClose,
  handleSubmitForm,
  formData
}: DepartmentModalProps) {

  const initialValues = {
    DepartmentName: formData.DepartmentName 
  };
  
  const validationSchema = {
    DepartmentName: {
      validate: (value: string) => {
        if (!value) {
          return 'DepartmentName is required';
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


  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={handleClose}
      >
          <DialogTitle id="modal-modal-title" variant="h6" component="h2">
            Adding/Modify Department
          </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt:2 }}>
              <TextFieldMU
                name="DepartmentName"
                label="Department Name"
                value={values.DepartmentName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.DepartmentName && Boolean(errors.DepartmentName)}
                helperText={touched.DepartmentName && errors.DepartmentName}
              />
            </Box>
            <DialogActions>
            <Button onClick={handleClose} type="submit" variant="contained" color="primary">
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
