import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// notify message
export const notify = (
  message,
  type = "success",
  position = toast.POSITION.TOP_RIGHT
) => {
  const toastOptions = {
    position: position,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Display different types of toasts based on the 'type' parameter
  if (type === "success") {
    toast.success(message, toastOptions);
  } else if (type === "error") {
    toast.error(message, toastOptions);
  } else if (type === "warning") {
    toast.warning(message, toastOptions);
  }
};
