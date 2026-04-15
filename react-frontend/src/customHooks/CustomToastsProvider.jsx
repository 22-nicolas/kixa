import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export default function CustomToastsProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({
        title = "Notification",
        message = "",
        variant = "primary", // success, danger, warning, info
        delay = 7000 // ms
    }) => {
        const id = title + message;
        
        const newToast = { id, title, message, variant, delay };

        setToasts(prev => {
            if(prev.some(t => t.id === id)) return prev;
            return [...prev, newToast]
        });

        // auto remove
        setTimeout(() => {
        removeToast(id);
        }, delay);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div
                className="toast-container position-fixed bottom-0 end-0 p-3"
                style={{ zIndex: 9999 }}
            >
                {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast show text-bg-${toast.variant} mb-2`}
                >
                    <div className="toast-header">
                    <strong className="me-auto">{toast.title}</strong>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => removeToast(toast.id)}
                    />
                    </div>
                    <div className="toast-body">
                    {toast.message}
                    </div>
                </div>
                ))}
            </div>

        </ToastContext.Provider>
    );
}

export function useToasts() {
    return useContext(ToastContext);
}