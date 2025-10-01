import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "store/reducers";

const LoggedInRedirection = () => {
  const url = new URL(window.location.href);
  const pathValue = url.searchParams.get("redirect");

  return pathValue && pathValue.trim().length > 1 ? (
    <Navigate to={`/${pathValue}`} />
  ) : (
    <Navigate to="/earnings" />
  );
};

const AdminLoggedInRedirection = () => {
  const url = new URL(window.location.href);
  const pathValue = url.searchParams.get("redirect");

  return pathValue && pathValue.trim().length > 1 ? (
    <Navigate to={`/${pathValue}`} />
  ) : (
    <Navigate to="/" />
  );
};

const UnProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, userDetails } = useSelector(
    (state: RootState) => state.userReducer
  );
  return (
    <>
      {!token || token.trim() === "" ? (
        children
      ) : userDetails?.role === "admin" ? (
        <AdminLoggedInRedirection />
      ) : (
        <LoggedInRedirection />
      )}
    </>
  );
};

export default UnProtectedRoute;
