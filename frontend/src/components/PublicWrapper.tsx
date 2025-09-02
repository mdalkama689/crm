import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '.././slices/store/store';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { fetchCurrentUser } from '../slices/AuthSlice';

const PublicWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate('/');
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return <Loader />;
  }

  return <Outlet />;
};

export default PublicWrapper;
