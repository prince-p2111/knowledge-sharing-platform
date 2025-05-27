export const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const hostname = window.location.hostname;
const port = "5000";

export const API_BASE_URL = `${hostname}:${port}/api`;
