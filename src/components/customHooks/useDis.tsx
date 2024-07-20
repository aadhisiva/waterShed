import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/configureStore';

export default function useDisptachForAction() {
  const dispatch = useDispatch<AppDispatch>();

  return [dispatch];
}
