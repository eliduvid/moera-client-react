import {
    TIMELINE_FUTURE_SLICE_LOAD,
    TIMELINE_FUTURE_SLICE_LOAD_FAILED,
    TIMELINE_FUTURE_SLICE_SET,
    TIMELINE_GENERAL_LOAD,
    TIMELINE_GENERAL_LOAD_FAILED,
    TIMELINE_GENERAL_SET,
    TIMELINE_PAST_SLICE_LOAD,
    TIMELINE_PAST_SLICE_LOAD_FAILED,
    TIMELINE_PAST_SLICE_SET,
    TIMELINE_SCROLLED,
    TIMELINE_SCROLLED_TO_ANCHOR, TIMELINE_UNSET
} from "state/timeline/actions";
import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_TIMELINE } from "state/navigation/pages";
import { POSTING_DELETED, POSTING_SET } from "state/postings/actions";
import { getPostingMoment } from "state/postings/selectors";

const emptyInfo = {
    operations: {
        add: []
    }
};

const initialState = {
    loadingGeneral: false,
    loadedGeneral: false,
    ...emptyInfo,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    postings: [],
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

const goToPageTimeline = (state, action) => {
    const anchor = action.payload.details.at;
    if (anchor != null) {
        if (anchor <= state.before && anchor > state.after) {
            return {
                ...state,
                anchor,
                scrollingActive: true
            }
        } else {
            return {
                ...state,
                before: anchor,
                after: anchor,
                postings: [],
                anchor,
                scrollingActive: true,
                at: anchor
            }
        }
    } else {
        return {
            ...state,
            scrollingActive: true
        }
    }
};

const goToPageOther = (state, action) => {
    if (state.scrollingActive) {
        return {
            ...state,
            anchor: state.at,
            scrollingActive: false
        }
    } else {
        return state;
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            if (action.payload.page === PAGE_TIMELINE) {
                return goToPageTimeline(state, action);
            } else {
                return goToPageOther(state, action);
            }

        case TIMELINE_GENERAL_LOAD:
            return {
                ...state,
                loadingGeneral: true
            };

        case TIMELINE_GENERAL_LOAD_FAILED:
            return {
                ...state,
                loadingGeneral: false
            };

        case TIMELINE_GENERAL_SET:
            return {
                ...state,
                ...emptyInfo,
                ...action.payload.info,
                loadingGeneral: false,
                loadedGeneral: true
            };

        case TIMELINE_PAST_SLICE_LOAD:
            return {
                ...state,
                loadingPast: true
            };

        case TIMELINE_PAST_SLICE_LOAD_FAILED:
            return {
                ...state,
                loadingPast: false
            };

        case TIMELINE_FUTURE_SLICE_LOAD:
            return {
                ...state,
                loadingFuture: true
            };

        case TIMELINE_FUTURE_SLICE_LOAD_FAILED:
            return {
                ...state,
                loadingFuture: false
            };

        case TIMELINE_PAST_SLICE_SET:
            if (action.payload.before >= state.after && action.payload.after < state.after) {
                let stories = state.postings.slice();
                action.payload.stories
                    .filter(s => s.moment <= state.after)
                    .forEach(s => stories.push({
                        id: s.posting.id,
                        moment: s.moment
                    }));
                stories.sort((a, b) => b.moment - a.moment);
                return {
                    ...state,
                    loadingPast: false,
                    after: action.payload.after,
                    postings: stories
                }
            } else {
                return {
                    ...state,
                    loadingPast: false
                }
            }

        case TIMELINE_FUTURE_SLICE_SET:
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                let stories = state.postings.slice();
                action.payload.stories
                    .filter(s => s.moment > state.before)
                    .forEach(s => stories.push({
                        id: s.posting.id,
                        moment: s.moment
                    }));
                stories.sort((a, b) => b.moment - a.moment);
                return {
                    ...state,
                    loadingFuture: false,
                    before: action.payload.before,
                    postings: stories
                }
            } else {
                return {
                    ...state,
                    loadingFuture: false
                }
            }

        case TIMELINE_UNSET:
            return {
                ...state,
                before: state.at,
                after: state.at,
                postings: [],
                anchor: state.at
            };

        case POSTING_SET: {
            const posting = action.payload.posting;
            const moment = getPostingMoment(posting, "timeline");
            if (moment != null && moment <= state.before && moment > state.after) {
                if (!state.postings.some(p => p.moment === moment)) {
                    const postings = state.postings.filter(p => p.id !== posting.id);
                    postings.push({
                        id: posting.id,
                        moment
                    });
                    postings.sort((a, b) => b.moment - a.moment);
                    return {
                        ...state,
                        postings
                    }
                }
            }
            return state;
        }

        case POSTING_DELETED: {
            const posting = action.payload; // Not really, but we need only the feed reference
            const moment = getPostingMoment(posting, "timeline");
            if (moment <= state.before && moment > state.after) {
                const index = state.postings.findIndex(p => p.id === posting.id);
                if (index >= 0) {
                    let postings = state.postings.slice();
                    postings.splice(index, 1);
                    return {
                        ...state,
                        postings
                    }
                }
            }
            return state;
        }

        case TIMELINE_SCROLLED:
            if (state.scrollingActive) {
                return {
                    ...state,
                    at: action.payload.at
                }
            } else {
                return state;
            }

        case TIMELINE_SCROLLED_TO_ANCHOR:
            return {
                ...state,
                anchor: null
            };

        default:
            return state;
    }
}
