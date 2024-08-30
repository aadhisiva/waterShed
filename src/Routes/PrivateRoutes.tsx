import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import useSelectorForUser from '../components/customHooks/useSelectForUser';
import useDisptachForAction from '../components/customHooks/useDis';
import { clearSessionEndTime, setSessionEndTime, userLoggedOut } from '../reducers/authReducer';
import HeaderWithSidebar from '../components/HeaderForLogin';

interface PrivateRouteProps {
  timeoutInMinutes: number;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ timeoutInMinutes }) => {
  const [{ isLoggedIn, sessionEndTime }] = useSelectorForUser();
  const [modalOpen, setModalOpen] = React.useState(false);

   const navigate = useNavigate();
  const [dispatch] = useDisptachForAction();

  const getRemainingTime = () => {
    if (sessionEndTime) {
      const remaining = (new Date(sessionEndTime).getTime() - Date.now()) / 1000;
      return remaining > 0 ? remaining : 0;
    }
    return timeoutInMinutes * 60;
  };

  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

  const setEndTimeInRedux = () => {
    const endTime = new Date(Date.now() + timeoutInMinutes * 60 * 1000).toISOString();
    dispatch(setSessionEndTime(endTime));
  };

  useEffect(() => {
    if (!sessionEndTime) {
      setEndTimeInRedux();
    }
  }, [sessionEndTime, timeoutInMinutes, dispatch]);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;

    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!sessionEndTime) {
        setEndTimeInRedux();
      }

      const timeUntilEnd = new Date(sessionEndTime || '').getTime() - Date.now();
      timeoutId = setTimeout(
        () => {
          setModalOpen(true);
          // dispatch(userLoggedOut());
          // dispatch(clearSessionEndTime());
          // navigate('/signin', { replace: true });
          // Clear other user-related state if necessary
        },
        timeUntilEnd > 0 ? timeUntilEnd : 0
      );
    };

    const clearTimerOnActivity = () => {
      resetTimeout();
    };

    resetTimeout();

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, clearTimerOnActivity);
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      events.forEach((event) => {
        document.removeEventListener(event, clearTimerOnActivity);
      });
    };
  }, [isLoggedIn, sessionEndTime, navigate, dispatch]);

  useEffect(() => {
    if (remainingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setModalOpen(true);
      // dispatch(userLoggedOut());
      // dispatch(clearSessionEndTime());
      // navigate('/signin', { replace: true });
    }
  }, [remainingTime, navigate, dispatch]);

  const logoutTime = new Date(Date.now() + remainingTime * 1000).toLocaleTimeString();

  return isLoggedIn ? 
  <HeaderWithSidebar logoutTime={logoutTime} setModalOpen={() => setModalOpen(false)} modalOpen={modalOpen}>
  <Outlet />
  </HeaderWithSidebar> : <Navigate to={'/login'} replace />; // SessionTimer component doesn't render anything
};

export default PrivateRoute;
