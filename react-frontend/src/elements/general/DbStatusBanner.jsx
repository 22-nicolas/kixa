import { useDbStatus } from "../../customHooks/DbStatusProvider.jsx";

export default function DbStatusBanner() {
    const { isConnected, isChecking, isDismissed, checkConnection, dismiss } = useDbStatus();

    if (isConnected || isDismissed) {
        return null;
    }

    return (
        <div className="db-status-banner alert alert-warning mb-0 rounded-0 d-flex align-items-center justify-content-between px-3 py-2" role="alert">
            <div className="d-flex align-items-center gap-2">
                <span className="db-status-pulse" />
                <span>
                    <strong>Database offline or waking up:</strong> On free hosting plans, the database sleeps or shuts down after inactivity. Please retry after some minutes. If the problem persist after several tries, please contact the me at <a href="mailto:nicolastutuianu04@gmail.com">nicolastutuianu04@gmail.com</a>.
                </span>
            </div>
            <div className="d-flex align-items-center gap-2 ms-3 flex-shrink-0">
                <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={checkConnection}
                    disabled={isChecking}
                >
                    {isChecking ? "Checking..." : "Retry Connection"}
                </button>
                <button
                    type="button"
                    className="btn-close btn-sm"
                    aria-label="Dismiss banner"
                    onClick={dismiss}
                />
            </div>
        </div>
    );
}
