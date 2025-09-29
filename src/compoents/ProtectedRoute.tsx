import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store/reducers";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useSelector((state: RootState) => state.userReducer);
  const path = window.location.pathname.replace("/", "");
  return token && token.trim() !== "" ? (
    children
  ) : (
    <Navigate to={"/?redirect=" + path} />
  );
};

export default ProtectedRoute;
