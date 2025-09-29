import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUser } from "store/actions/user";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetUser());
    const url = new URL(window.location.href);
    const pathValue = url.searchParams.get("redirect");
    if (pathValue && pathValue.trim().length > 1) {
      navigate(`/?redirect=${pathValue}`);
    } else {
      navigate("/");
    }
    localStorage.clear();
  }, []);
  return null;
};

export default Logout;
