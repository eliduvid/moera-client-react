export const ERROR_THROWN = "ERROR_THROWN";
export const errorThrown = (e) => ({
    type: ERROR_THROWN,
    payload: {
        e
    }
});

export const ERROR_SHOW = "ERROR_SHOW";
export const errorShow = (message, messageVerbose = "") => ({
    type: ERROR_SHOW,
    payload: {
        message,
        messageVerbose
    }
});

export const ERROR_DISMISS = "ERROR_DISMISS";
export const errorDismiss = () => ({
    type: ERROR_DISMISS
});

export const ERROR_AUTH_INVALID = "ERROR_AUTH_INVALID";
export const errorAuthInvalid = () => ({
    type: ERROR_AUTH_INVALID
});
