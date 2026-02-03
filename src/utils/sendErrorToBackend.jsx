const API_BASE = `${import.meta.env.VITE_BASEURL}`;

const sendErrorToBackend = async (error, actionName) => {
    try {
        await fetch(`${API_BASE}/api/client-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                error: {
                    message: error.message || "Unknown Error",
                    stack: error.stack || null, // Very important for debugging
                    code: error.code || null    // Network error codes
                },
                context: actionName,
                // This tells you if they are on iPhone, Android, Chrome, Safari, etc.
                device: navigator.userAgent
            })
        });
    } catch (loggingError) {
        // If logging fails, just log locally so we don't cause an infinite loop
        console.error("Failed to send error report:", loggingError);
    }
};