import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store/reducers";

const AdminProtectedRoute = ({ children }: any) => {
  const { token, userDetails } = useSelector(
    (state: RootState) => state.userReducer
  );
  const path = window.location.pathname.replace("/", "");
  return token && token.trim() !== "" && userDetails?.role === "admin" ? (
    children
  ) : (
    <Navigate to={"/?redirect=" + path} />
  );
};

export default AdminProtectedRoute;
