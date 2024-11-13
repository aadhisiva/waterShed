import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import useForm from '../formhandle/customValidation';
import TextFieldMU from '../formhandle/TextField';
import SelectField from '../formhandle/SelectField';
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

export default function QuestionDropdownTypeModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
  const [loading, setLoading] = React.useState(false);

  const initialValues = {
    DropdownName: formData.DropdownName,
    DropdownType: formData.DropdownType
  };

  const validationSchema = {
    DropdownName: {
      validate: (value: string) => {
        if (!value) {
          return 'DropdownName is required';
        }
        return nameValid(value);
      },
    },
    DropdownType: {
      validate: (value: string) => {
        if (!value) {
          return 'DropdownType is required';
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

  const DropdownTypes = [
    {
      value: 'Crops',
      name: 'Crops',
    },
    {
      value: 'Fruits',
      name: 'Fruits',
    },
    {
      value: 'Seeds',
      name: 'Seeds',
    },
    {
      value: 'Gender',
      name: 'Gender',
    },
    {
      value: 'CategoryGeneral',
      name: 'CategoryGeneral',
    },
    {
      value: 'StatusOfWork',
      name: 'StatusOfWork',
    },
    {
      value: 'FinancialYear',
      name: 'FinancialYear',
    },
    {
      value: 'CropsForAEP',
      name: 'CropsForAEP',
    },
    {
      value: 'TopicsCover-S',
      name: 'TopicsCover-S',
    },
    {
      value: 'TopicsCover-E',
      name: 'TopicsCover-E',
    },
    {
      value: 'TopicsCover-U',
      name: 'TopicsCover-U',
    },
    {
      value: 'Yes/No',
      name: 'Yes/No',
    }
  ];
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
          Adding/Modify Question Dropdown Modal
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <TextFieldMU
                name="DropdownName"
                label="Drropdown Name"
                value={values.DropdownName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.DropdownName && Boolean(errors.DropdownName)}
                helperText={touched.DropdownName && errors.DropdownName}
              />
              <SelectField
                name="DropdownType"
                label="DropdownType"
                value={values.DropdownType}
                onChange={handleChange}
                options={DropdownTypes}
                onBlur={handleBlur}
                error={touched.DropdownType && Boolean(errors.DropdownType)}
                helperText={touched.DropdownType && errors.DropdownType}
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
