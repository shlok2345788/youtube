// Simple toast utility - can be replaced with sonner later
type ToastType = "success" | "error" | "info";

const showToast = (message: string, type: ToastType = "info") => {
  // For now, use console and alert
  // In production, replace with sonner or another toast library
  if (type === "error") {
    console.error(message);
    alert(`Error: ${message}`);
  } else if (type === "success") {
    console.log(message);
    alert(`Success: ${message}`);
  } else {
    console.log(message);
  }
};

export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  info: (message: string) => showToast(message, "info"),
};


