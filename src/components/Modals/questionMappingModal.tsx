import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import useForm from '../formhandle/customValidation';
import SelectField from '../formhandle/SelectField';
import SpinnerLoader from '../spinner/spinner';
import TransferList from '../formhandle/transferList';
import axiosInstance from '../../axiosInstance';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

interface ActivityModalProps {
  open: boolean;
  handleClose?: any;
  handleSubmitForm?: any;
  formData?: any;
}

type Values = {
  [key: string]: string;
};

// Define types
interface Item {
  value: number;
  name: string;
}

export default function QuestionMappingModal({
  open,
  handleClose,
  handleSubmitForm,
  formData,
}: ActivityModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [landOptions, setLandOptions] = React.useState([]);
  const [activityOption, setActivityOption] = React.useState([]);
  const [left, setLeft] = React.useState<readonly Item[]>([]);
  const [right, setRight] = React.useState<readonly Item[]>([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fecthIntialData();
  }, []);

  const fecthIntialData = async () => {
    setLoading(true);
    let { data } = await axiosInstance.post('addOrGetQuestions', {
      ReqType: 'Dd',
    });
    let response = await axiosInstance.post('addOrGetsActivity', {
      ReqType: 'Dd',
    });
    if (data?.code == 200) {
      setLeft(data.data);
      setActivityOption(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
      alert(data.message || 'please try again');
    }
  };

  const initialValues: any = {
    ActivityId: formData.ActivityId,
    TypeOfLand: formData.TypeOfLand,
  };

  const validationSchema = {
    ActivityId: {
      validate: (value: string) => {
        if (!value) {
          return 'ActivityName is required';
        }
        return null;
      },
    },
  };

  const onSubmit = (values: any) => {
    // Handle form submission logic, e.g., API call
    values.id = formData.id;
    if (right.length == 0)
      return setError('Select values and move to right side list');
    setError('');
    let getValues = right.map((item: Item) => {
      return {
        QuestionId: item.value,
        ActivityId: values.ActivityId,
        TypeOfLand: values.TypeOfLand,
      };
    });
    handleSubmitForm(getValues);
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

  const handleChangeActivity = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setLoading(true);
      setValues({
        ...values,
        ActivityId: e.target.value,
      });
      setLoading(true);
      let { data } = await axiosInstance.post('getActivityDetails', {
        ActivityId: e.target.value,
      });
      setLandOptions(data.data);
    } catch (e) {
      setLoading(false);
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
          Mapping Questions
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2, mt: 2 }}>
              <SelectField
                name="ActivityId"
                label="Activity Name"
                value={values.ActivityId}
                onChange={handleChangeActivity}
                options={activityOption}
                onBlur={handleBlur}
                error={touched.ActivityId && Boolean(errors.ActivityId)}
                helperText={touched.ActivityId && errors.ActivityId}
              />
              <SelectField
                name="TypeOfLand"
                label="TypeOfLand"
                value={values.TypeOfLand}
                onChange={handleChange}
                options={landOptions}
                onBlur={handleBlur}
                error={touched.TypeOfLand && Boolean(errors.TypeOfLand)}
                helperText={touched.TypeOfLand && errors.TypeOfLand}
              />
              <FormControl error={error ? true : false}>
                <span>Select questions and move to right side list</span>
                <TransferList
                  left={left}
                  right={right}
                  setLeft={setLeft}
                  setRight={setRight}
                />
                <FormHelperText>{error}</FormHelperText>
              </FormControl>
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
