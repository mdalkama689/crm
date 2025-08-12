import { useNavigate } from 'react-router-dom';

export function useNavigateToBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}
