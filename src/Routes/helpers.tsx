import { redirect } from 'react-router-dom';
import useSelectorForUser from '../components/customHooks/useSelectForUser';

export const isAuthenticated = async () => {
  const [{isLoggedIn}] = useSelectorForUser();
  if (isLoggedIn) throw redirect('/');
  return null;
};
