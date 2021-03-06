import { GO_TO_PAGE, LOCATION_LOCK, LOCATION_SET, LOCATION_UNLOCK } from "state/navigation/actions";
import { PAGE_TIMELINE } from "state/navigation/pages";

const initialState = {
    page: PAGE_TIMELINE,
    location: "",
    title: "",
    update: false,
    locked: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            return {
                ...state,
                page: action.payload.page
            };

        case LOCATION_SET:
            return {
                ...state,
                ...action.payload
            };

        case LOCATION_LOCK:
            return {
                ...state,
                locked: true
            };

        case LOCATION_UNLOCK:
            return {
                ...state,
                locked: false
            };

        default:
            return state;
    }
}
