import toast from "react-hot-toast";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ReactNode } from "react";

const TOAST_DURATION = 3600;

type NotificationType = "success" | "error" | "info";

type NotificationOptions = {
  title: string;
  message?: string;
  icon?: ReactNode;
};

function ToastCard({
  type,
  title,
  message,
  toastId,
  icon,
}: NotificationOptions & { type: NotificationType; toastId: string }) {
  const Icon =
    type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`secure-toast secure-toast-${type}`}
      onClick={() => toast.dismiss(toastId)}
    >
      <div className="secure-toast-icon" aria-hidden="true">
        {icon ?? <Icon className="h-5 w-5" strokeWidth={2.4} />}
      </div>
      <div className="secure-toast-content">
        <p className="secure-toast-title">{title}</p>
        {message ? <p className="secure-toast-message">{message}</p> : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="secure-toast-close"
        onClick={(event) => {
          event.stopPropagation();
          toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </button>
      <span className="secure-toast-progress" aria-hidden="true" />
    </div>
  );
}

function show(type: NotificationType, options: NotificationOptions) {
  return toast.custom(
    (toastState) => (
      <ToastCard
        type={type}
        {...options}
        toastId={toastState.id}
      />
    ),
    {
      duration: TOAST_DURATION,
      position: "top-right",
    },
  );
}

export const notify = {
  success(title: string, message?: string) {
    return show("success", { title, message });
  },
  error(title: string, message?: string) {
    return show("error", { title, message });
  },
  info(title: string, message?: string) {
    return show("info", { title, message });
  },
};

export const notificationDuration = TOAST_DURATION;
