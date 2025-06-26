import { toast, ToastOptions, TypeOptions } from 'react-toastify';

interface ShowToastOptions extends ToastOptions {
  type?: TypeOptions;
}

export function showToast(
  message: string,
  type: 'success' | 'error' = 'success',
  options?: ShowToastOptions
) {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    ...options,
    type,
  };
  toast(message, defaultOptions);
}
