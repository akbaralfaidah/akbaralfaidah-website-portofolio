import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      onClose?.();
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto rounded-xl bg-surface text-ink border border-line shadow-xl px-4 py-3 flex items-start gap-3"
    >
      <span
        className={`mt-0.5 shrink-0 ${
          isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
        }`}
        aria-hidden="true"
      >
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </span>
      <p className="text-xs sm:text-sm font-medium leading-snug text-ink flex-1 pr-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="-mr-1 -mt-1 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-mist transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
