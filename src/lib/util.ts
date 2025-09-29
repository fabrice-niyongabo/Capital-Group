import { toast } from "react-toastify";
import { store } from "store";
import { setShowLogin } from "store/actions/app";

type ExtraHeaders = {
  [key: string]: string;
};
type TOAST_MESSAGE_TYPES = "INFO" | "ERROR" | "SUCCESS";

export const handleAuthError = (error: any) => {
  if (error?.response?.status === 401) {
    //@ts-ignore
    window.location =
      "/logout?redirect=" + window.location.pathname.replace("/", "");
    //@ts-ignore
    store.dispatch(setShowLogin(true));
  }
};

export const returnErroMessage = (error: any) => {
  if (error?.response?.data?.msg) {
    return error.response.data.msg;
  } else if (error.message) {
    return error.message;
  } else {
    return error;
  }
};

export const randomNumber = () => {
  const max = 99999;
  const min = 11111;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const toastMessage = (type: TOAST_MESSAGE_TYPES, message: string) => {
  if (type === "INFO") {
    toast.info(message);
  }
  if (type === "ERROR") {
    toast.error(message);
  }
  if (type === "SUCCESS") {
    toast.success(message);
  }
};

export const errorHandler = (error: any) => {
  if (error?.response?.data?.message) {
    toastMessage("ERROR", error.response.data.message);
  } else {
    toastMessage("ERROR", error.message);
  }
  handleAuthError(error);
};

export const currencyFormatter = (num: any): string => {
  if (
    isNaN(num) ||
    num === undefined ||
    num === null ||
    typeof num === "undefined"
  ) {
    // throw new Error(`currencyFormatter Failed,not a NUM`)
    // console.log("Num:-", num)
    return "";
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(Number(num));
};

export const setAuthHeaders = (token: string, extra?: ExtraHeaders) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...extra,
    },
  };
};
