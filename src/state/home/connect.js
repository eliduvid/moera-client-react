import { call, put, select } from 'redux-saga/effects';

import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/misc";
import { connectedToHome, connectionToHomeFailed, homeOwnerSet, homeOwnerVerified } from "state/home/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Browser, Naming, Node, NodeApiError, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { getHomeConnectionData } from "state/home/selectors";

function* connectToHomeFailure(error, onClose = null) {
    yield put(connectionToHomeFailed());
    yield put(messageBox("Connection to home failed: " + error.message, onClose));
}

export function* connectToHomeSaga(action) {
    const {location, assign, login, password} = action.payload;
    let data;
    try {
        if (assign) {
            yield call(Node.createCredentials, location, login, password);
        }
        data = yield call(Node.createToken, location, login, password);
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield call(connectToHomeFailure, e, openConnectDialog());
        } else {
            yield call(connectToHomeFailure, e);
        }
        return;
    }

    let cartesData = {
        cartes: []
    };
    try {
        cartesData = yield call(Node.getCartes, location, data.token);
    } catch (e) {
        yield put(errorThrown(e));
    }

    Browser.storeConnectionData(normalizeUrl(location), null, login, data.token, data.permissions);
    Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
    yield put(connectedToHome(normalizeUrl(location), login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes));
}

export function* verifyHomeOwnerSaga() {
    try {
        const {nodeName} = yield call(Node.getWhoAmI, ":");
        yield put(homeOwnerSet(nodeName));

        const {location, login, token, permissions} = yield select(getHomeConnectionData);
        Browser.storeConnectionData(location, nodeName, login, token, permissions);

        const {name, generation} = NodeName.parse(nodeName);
        if (name == null || generation == null) {
            return;
        }
        const ndata = yield call(Naming.getCurrent, name, generation);
        const rootPage = yield select(state => state.home.root.page);
        const correct = ndata && normalizeUrl(ndata.nodeUri) === rootPage;
        const latest = ndata && ndata.latest;
        yield put(homeOwnerVerified(nodeName, latest, correct, ndata.deadline));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
