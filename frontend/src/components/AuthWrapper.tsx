import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../slices/store';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { fetchCurrentUser } from '../slices/auth/AuthSlice';

const AuthWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {

    if (!isLoading && !isLoggedIn) {
      navigate('/sign-in');
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return <Loader />;
  }

  return <Outlet />;
};

export default AuthWrapper;
