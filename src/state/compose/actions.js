export const COMPOSE_FEATURES_LOAD = "COMPOSE_FEATURES_LOAD";
export const composeFeaturesLoad = () => ({
    type: COMPOSE_FEATURES_LOAD
});

export const COMPOSE_FEATURES_LOADED = "COMPOSE_FEATURES_LOADED";
export const composeFeaturesLoaded = (features) => ({
    type: COMPOSE_FEATURES_LOADED,
    payload: {features}
});

export const COMPOSE_FEATURES_LOAD_FAILED = "COMPOSE_FEATURES_LOAD_FAILED";
export const composeFeaturesLoadFailed = () => ({
    type: COMPOSE_FEATURES_LOAD_FAILED
});

export const COMPOSE_FEATURES_UNSET = "COMPOSE_FEATURES_UNSET";
export const composeFeaturesUnset = () => ({
    type: COMPOSE_FEATURES_UNSET
});

export const COMPOSE_POSTING_LOAD = "COMPOSE_POSTING_LOAD";
export const composePostingLoad = () => ({
    type: COMPOSE_POSTING_LOAD
});

export const COMPOSE_POSTING_LOADED = "COMPOSE_POSTING_LOADED";
export const composePostingLoaded = (posting) => ({
    type: COMPOSE_POSTING_LOADED,
    payload: {posting}
});

export const COMPOSE_POSTING_LOAD_FAILED = "COMPOSE_POSTING_LOAD_FAILED";
export const composePostingLoadFailed = () => ({
    type: COMPOSE_POSTING_LOAD_FAILED
});

export const COMPOSE_CONFLICT = "COMPOSE_CONFLICT";
export const composeConflict = () => ({
    type: COMPOSE_CONFLICT
});

export const COMPOSE_CONFLICT_CLOSE = "COMPOSE_CONFLICT_CLOSE";
export const composeConflictClose = () => ({
    type: COMPOSE_CONFLICT_CLOSE
});

export const COMPOSE_POST = "COMPOSE_POST";
export const composePost = (id, postingText) => ({
    type: COMPOSE_POST,
    payload: {id, postingText}
});

export const COMPOSE_POST_SUCCEEDED = "COMPOSE_POST_SUCCEEDED";
export const composePostSucceeded = (posting) => ({
    type: COMPOSE_POST_SUCCEEDED,
    payload: {posting}
});

export const COMPOSE_POST_FAILED = "COMPOSE_POST_FAILED";
export const composePostFailed = () => ({
    type: COMPOSE_POST_FAILED
});