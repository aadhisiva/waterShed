import { RootState } from '../../store/configureStore';
import { useSelector, TypedUseSelectorHook } from 'react-redux';

// Define a typed version of the useSelector hook
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function useSelectorForUser() {
  const state = useTypedSelector((state) => state.user);
  return [state];
}
