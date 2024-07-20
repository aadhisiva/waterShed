import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSelectorForUser from '../components/customHooks/useSelectForUser';
import useDisptachForAction from '../components/customHooks/useDis';
import { clearSessionEndTime, userLoggedOut } from '../reducers/authReducer';

export default function Dashboard() {
  const navigate = useNavigate();
  const [state] = useSelectorForUser();
  const [dispatch] = useDisptachForAction();

  return (
    <div>
      {/* <MiniDrawer /> */}
      DASHBOARD, Jsx
      <button
        onClick={() => {
          dispatch(userLoggedOut());
          dispatch(clearSessionEndTime());
          navigate('/signin', { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
}
