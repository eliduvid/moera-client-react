import {
    CANCEL_CONNECT_DIALOG,
    OPEN_CONNECT_DIALOG,
    RESTORE_CONNECT_DIALOG
} from "state/connectdialog/actions";
import { CONNECT_TO_HOME, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

const initialState = {
    show: false,
    location: "",
    login: "admin",
    assign: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CONNECT_DIALOG:
            return {
                ...state,
                show: true
            };

        case CANCEL_CONNECT_DIALOG:
            return {
                ...state,
                show: false
            };

        case CONNECT_TO_HOME:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login,
                assign: action.payload.assign,
                show: false
            };

        case CONNECTED_TO_HOME:
            return {
                ...state,
                assign: false
            };

        case DISCONNECTED_FROM_HOME:
            return {
                ...state,
                location: action.payload.location || initialState.location,
                login: action.payload.login || initialState.login
            };

        case RESTORE_CONNECT_DIALOG:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login
            };

        default:
            return state;
    }
}
