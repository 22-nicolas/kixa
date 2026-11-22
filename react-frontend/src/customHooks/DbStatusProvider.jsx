import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
    getDbStatus,
    isBannerHidden,
    setBannerDismissed,
    setDbStatus,
    subscribeToDbStatus,
    unsubscribeFromDbStatus,
    pingDbHealth
} from "../modules/dbStatus.js";
import { useToasts } from "./CustomToastsProvider.jsx";

const DbStatusContext = createContext();

export default function DbStatusProvider({ children }) {
    const [isConnected, setIsConnected] = useState(getDbStatus());
    const [isDismissed, setIsDismissed] = useState(isBannerHidden());
    const [isChecking, setIsChecking] = useState(false);
    const { addToast } = useToasts();

    useEffect(() => {
        const handler = (connected, dismissed) => {
            setIsConnected(connected);
            setIsDismissed(dismissed);
        };
        subscribeToDbStatus(handler);
        return () => unsubscribeFromDbStatus(handler);
    }, []);

    // Automatic polling when disconnected to detect DB cold-start wake up
    useEffect(() => {
        if (isConnected) return;

        const interval = setInterval(async () => {
            const ok = await pingDbHealth();
            if (ok) {
                addToast({
                    title: "Database Connected",
                    message: "Database woke up and is back online!",
                    variant: "success",
                    delay: 5000
                });
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [isConnected, addToast]);

    const checkConnection = useCallback(async () => {
        setIsChecking(true);
        try {
            const ok = await pingDbHealth();
            if (ok) {
                addToast({
                    title: "Database Connected",
                    message: "Database is now online!",
                    variant: "success",
                    delay: 5000
                });
            } else {
                addToast({
                    title: "Still Waking Up",
                    message: "The database is still offline or starting up. Please wait a few moments and try again.",
                    variant: "warning",
                    delay: 5000
                });
            }
            return ok;
        } finally {
            setIsChecking(false);
        }
    }, [addToast]);

    const dismiss = useCallback(() => {
        setBannerDismissed(true);
    }, []);

    return (
        <DbStatusContext.Provider value={{ isConnected, isChecking, isDismissed, checkConnection, dismiss }}>
            {children}
        </DbStatusContext.Provider>
    );
}

export function useDbStatus() {
    return useContext(DbStatusContext);
}
