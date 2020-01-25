import immutable from 'object-path-immutable';

import { CONNECTED_TO_HOME, DISCONNECT_FROM_HOME } from "state/home/actions";

const initialState = {
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECTED_TO_HOME:
            return immutable(state)
                .set([action.payload.location, "token"], action.payload.token)
                .set([action.payload.location, "permissions"], action.payload.permissions)
                .value();

        case DISCONNECT_FROM_HOME:
            return immutable.del(state, [action.payload.location]);

        default:
            return state;
    }
}