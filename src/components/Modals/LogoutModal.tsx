import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import useForm from '../formhandle/customValidation';
import TextFieldMU from '../formhandle/TextField';
import useDisptachForAction from '../customHooks/useDis';
import { clearSessionEndTime, userLoggedOut } from '../../reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutModal {
  open: boolean;
  handleClose?: any;
}

export default function LogoutModal({ open, handleClose }: LogoutModal) {
    const [loading, setLoading] = React.useState(false);
  const [dispatch] = useDisptachForAction();
  const navigate = useNavigate();

  const handleClickLogout = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        dispatch(userLoggedOut());
        dispatch(clearSessionEndTime());
        navigate('/signin', { replace: true });
    }, 2000);
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
          Session Information
        </DialogTitle>
        <DialogContent>
          Your Session completed, Please Login Again.
        </DialogContent>
        <DialogActions>
          <LoadingButton
          size="small"
          onClick={handleClickLogout}
          endIcon={<LogoutIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          <span>Logout</span>
        </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
