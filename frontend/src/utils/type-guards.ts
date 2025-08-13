import axios, { AxiosError } from "axios";
import type { WalletError } from "../types";

export function isWalletError(error: unknown): error is WalletError {
  return (
    error instanceof Error && typeof (error as WalletError).code !== "undefined"
  );
}

export function isBackendError(error: unknown): error is AxiosError {
  return (
    axios.isAxiosError(error) &&
    error.response !== undefined &&
    typeof error.response.status === "number"
  );
}
