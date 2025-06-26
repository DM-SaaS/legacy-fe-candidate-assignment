import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

export function showToast(
  message: string,
  type: 'success' | 'error' = 'success',
  options?: ToastOptions
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
