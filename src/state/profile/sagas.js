import { call, put } from 'redux-saga/effects';

import { errorThrown } from "state/error/actions";
import { profileLoadFailed, profileSet, profileUpdateFailed, profileUpdateSucceeded } from "state/profile/actions";
import { Node } from "api/node";

export function* profileLoadSaga() {
    try {
        const data = yield call(Node.getProfile, "");
        yield put(profileSet(data));
    } catch (e) {
        yield put(profileLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* profileUpdateSaga(action) {
    try {
        const data = yield call(Node.putProfile, "", action.payload);
        yield put(profileUpdateSucceeded());
        yield put(profileSet(data));
    } catch (e) {
        yield put(profileUpdateFailed());
        yield put(errorThrown(e));
    }
}
