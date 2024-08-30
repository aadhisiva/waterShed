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
import { questionIdValid } from '../../utils/validations';

interface ActivityModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

export default function QuestionsModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
  const [dropdownItems, setDropdownItems] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const initialValues: any = {
    Question: formData.Question,
    QuestionType: formData.QuestionType,
    // DropDownValues: formData.DropDownValues,
    QuestionId: formData.QuestionId,
  };

  const validationSchema = {
    Question: {
      validate: (value: string) => {
        if (!value) {
          return 'Question is required';
        }
        return null;
      },
    },
    QuestionId: {
      validate: (value: string) => {
        if (!value) {
          return 'QuestionId is required';
        }
        return questionIdValid(value);
      },
    },
    QuestionType: {
      validate: (value: string) => {
        if (!value) {
          return 'QuestionType is required';
        }
        return null;
      },
    },
    DropDownValues: {
      validate: (value: string) => {
        if(values.QuestionType == "DropdownFromId" && !value){
          return 'DropDownValues is required';
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
  if(values.QuestionType == "DropdownFromId"){
    initialValues.DropDownValues= formData.DropDownValues;
  };

  React.useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('addOrGetQuestionDropDownTypes', { ReqType: 'Dd' });
    if (data?.code == 200) {
      setDropdownItems(data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };
  const questionTypes = [
    {
      value: 'DropdownFromApi',
      name: 'DropdownFromApi',
    },
    {
      value: 'DropdownFromId',
      name: 'DropdownFromId',
    },
    {
      value: 'Input',
      name: 'Input',
    },
    {
      value: 'Photo',
      name: 'Photo',
    },
    {
      value: 'Gps',
      name: 'Gps',
    },
    {
      value: 'Date',
      name: 'Date',
    },
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
          Adding/Modify Question Modal
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <TextFieldMU
                name="QuestionId"
                label="Question Id"
                value={values.QuestionId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.QuestionId && Boolean(errors.QuestionId)}
                helperText={touched.QuestionId && errors.QuestionId}
              />
              <TextFieldMU
                name="Question"
                label="Question Text"
                value={values.Question}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.Question && Boolean(errors.Question)}
                helperText={touched.Question && errors.Question}
              />
              <SelectField
                name="QuestionType"
                label="QuestionType"
                value={values.QuestionType}
                onChange={handleChange}
                options={questionTypes}
                onBlur={handleBlur}
                error={touched.QuestionType && Boolean(errors.QuestionType)}
                helperText={touched.QuestionType && errors.QuestionType}
              />
              {(values.QuestionType == "DropdownFromId") && (
                <SelectField
                  name="DropDownValues"
                  label="DropDownValues"
                  value={values.DropDownValues}
                  onChange={handleChange}
                  options={dropdownItems}
                  onBlur={handleBlur}
                  error={touched.DropDownValues && Boolean(errors.DropDownValues)}
                  helperText={touched.DropDownValues && errors.DropDownValues}
                />
              )} 
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
