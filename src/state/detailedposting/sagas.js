import { call, put, select } from 'redux-saga/effects';
import clipboardCopy from 'clipboard-copy';
import * as textFieldEdit from 'text-field-edit';

import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import {
    commentDeleted,
    commentDeleteFailed,
    commentDialogCommentLoaded,
    commentDialogCommentLoadFailed,
    commentLoadFailed,
    commentPosted,
    commentPostFailed,
    commentReactionSet,
    commentRepliedToSet,
    commentSet,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    commentsReceiverSwitched,
    commentsScrollToComposer,
    commentVerifyFailed,
    detailedPostingLoaded,
    detailedPostingLoadFailed,
    focusedCommentLoaded,
    focusedCommentLoadFailed,
    glanceCommentLoaded,
    glanceCommentLoadFailed
} from "state/detailedposting/actions";
import {
    getComment,
    getCommentComposerCommentId,
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId,
    isCommentComposerReplied
} from "state/detailedposting/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { postingCommentsSet } from "state/postings/actions";
import { getOwnerName } from "state/owner/selectors";
import { flashBox } from "state/flashbox/actions";
import { postingGetLink } from "state/postings/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { getWindowSelectionHtml, mentionName } from "util/misc";
import { quoteHtml } from "util/html";

export function* detailedPostingLoadSaga() {
    try {
        const id = yield select(getDetailedPostingId);
        const data = yield call(Node.getPosting, "", id);
        yield call(fillActivityReaction, data)
        yield call(fillSubscription, data)
        yield put(detailedPostingLoaded(data));
    } catch (e) {
        yield put(detailedPostingLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* commentsReceiverSwitchSaga() {
    const {ownerName, posting} = yield select(state => ({
        ownerName: getOwnerName(state),
        posting: getDetailedPosting(state)
    }));
    const receiverName = posting.receiverName ?? ownerName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    yield put(commentsReceiverSwitched(receiverName, receiverPostingId));
}

export function* commentsLoadAllSaga() {
    let {receiverName, receiverPostingId, before, after} = yield select(getCommentsState);
    try {
        while (after > Number.MIN_SAFE_INTEGER) {
            const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, null, after, 20);
            yield put(commentsPastSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
                data.totalInPast, data.totalInFuture));
            // TODO yield call(cacheNames, data.stories);
            after = data.after;
        }
        while (before < Number.MAX_SAFE_INTEGER) {
            const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, before, null, 20);
            yield put(commentsFutureSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
                data.totalInPast, data.totalInFuture));
            // TODO yield call(cacheNames, data.stories);
            before = data.before;
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* commentsPastSliceLoadSaga() {
    const {receiverName, receiverPostingId, after} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, null, after, 20);
        yield put(commentsPastSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
            data.totalInPast, data.totalInFuture));
        // TODO yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsPastSliceLoadFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

export function* commentsFutureSliceLoadSaga() {
    const {receiverName, receiverPostingId, before} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getCommentsSlice, receiverName, receiverPostingId, before, null, 20);
        yield put(commentsFutureSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
            data.totalInPast, data.totalInFuture));
        // TODO yield call(cacheNames, data.stories);
    } catch (e) {
        yield put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

export function* commentLoadSaga(action) {
    const {commentId} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getComment, receiverName, receiverPostingId, commentId);
        yield put(commentSet(receiverName, data));
    } catch (e) {
        yield put(commentLoadFailed(receiverName, receiverPostingId, commentId));
        yield put(errorThrown(e));
    }
}

export function* commentPostSaga(action) {
    const {commentId, postingId, commentText} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        let comment;
        if (commentId == null) {
            const data = yield call(Node.postComment, receiverName, receiverPostingId, commentText);
            yield put(postingCommentsSet(postingId, data.total));
            comment = data.comment;
        } else {
            comment = yield call(Node.putComment, receiverName, receiverPostingId, commentId, commentText);
        }
        yield put(commentSet(receiverName, comment));
        yield put(commentPosted(receiverName, receiverPostingId, comment.id, comment.moment));
        yield call(Node.putRemoteComment, ":", receiverName, receiverPostingId, comment.id, commentText);
    } catch (e) {
        yield put(commentPostFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}

export function* commentDeleteSaga(action) {
    const {commentId} = action.payload;

    const {postingId, receiverName, receiverPostingId} = yield select(state => ({
        postingId: getDetailedPostingId(state),
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId
    }));
    try {
        const data = yield call(Node.deleteComment, receiverName, receiverPostingId, commentId);
        yield put(commentDeleted(receiverName, receiverPostingId, commentId));
        yield put(postingCommentsSet(postingId, data.total));
        yield call(Node.deleteRemoteComment, ":", receiverName, receiverPostingId, commentId);
    } catch (e) {
        yield put(commentDeleteFailed(receiverName, receiverPostingId, commentId));
        yield put(errorThrown(e));
    }
}

export function* focusedCommentLoadSaga() {
    const {receiverName, receiverPostingId, focusedCommentId} = yield select(getCommentsState);
    try {
        const data = yield call(Node.getComment, receiverName, receiverPostingId, focusedCommentId);
        yield put(focusedCommentLoaded(receiverName, data));
    } catch (e) {
        yield put(focusedCommentLoadFailed(receiverName, receiverPostingId));
        if (!(e instanceof NodeApiError) || e.errorCode !== "comment.not-found") {
            yield put(errorThrown(e));
        } else {
            yield put(flashBox("Comment not found"));
        }
    }
}

export function* commentCopyLinkSaga(action) {
    const {id, postingId} = action.payload;
    try {
        const href = yield call(postingGetLink, postingId);
        yield call(clipboardCopy, `${href}?comment=${id}`);
        yield put(flashBox("Link copied to the clipboard"));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* commentDialogCommentLoadSaga() {
    const {receiverName, receiverPostingId, commentId} = yield select(state => ({
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        commentId: getCommentComposerCommentId(state)
    }));
    try {
        const data = yield call(Node.getComment, receiverName, receiverPostingId, commentId, true);
        yield put(commentDialogCommentLoaded(data));
    } catch (e) {
        yield put(commentDialogCommentLoadFailed());
        yield put(errorThrown(e));
    }
}

export function* commentVerifySaga(action) {
    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        yield call(Node.remoteCommentVerify, ":", receiverName, receiverPostingId, action.payload.commentId);
    } catch (e) {
        yield put(commentVerifyFailed());
        yield put(errorThrown(e));
    }
}

export function* commentReactSaga(action) {
    const {id, negative, emoji} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        const data = yield call(Node.postCommentReaction, receiverName, receiverPostingId, id, negative, emoji);
        yield put(commentReactionSet(receiverName, id, receiverPostingId, {negative, emoji}, data.totals));
        yield call(Node.postRemoteCommentReaction, ":", receiverName, receiverPostingId, id, negative, emoji);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* commentReactionLoadSaga(action) {
    const {id} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        const {negative, emoji} = yield call(Node.getCommentReaction, receiverName, receiverPostingId, id);
        const totals = yield call(Node.getCommentReactionTotals, receiverName, receiverPostingId, id);
        yield put(commentReactionSet(receiverName, id, receiverPostingId, {negative, emoji}, totals));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* commentReactionDeleteSaga(action) {
    const {id} = action.payload;

    const {receiverName, receiverPostingId} = yield select(getCommentsState);
    try {
        const data = yield call(Node.deleteCommentReaction, receiverName, receiverPostingId, id);
        yield put(commentReactionSet(receiverName, id, receiverPostingId, null, data));
        yield call(Node.deleteRemoteCommentReaction, ":", receiverName, receiverPostingId, id);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* commentReplySaga(action) {
    const {commentId, ownerName, heading} = action.payload;

    const body = document.getElementById("body");
    const reply = body.textLength === 0 && !(yield select(isCommentComposerReplied));
    const text = quoteHtml(getWindowSelectionHtml());
    if (reply) {
        yield put(commentRepliedToSet(commentId, ownerName, heading));
        if (text) {
            textFieldEdit.insert(body, `>>>\n${text}\n>>>\n`);
        }
    } else {
        const mention = yield select(mentionName, ownerName);
        if (text) {
            textFieldEdit.insert(body, `${mention}:\n>>>\n${text}\n>>>\n`);
        } else {
            textFieldEdit.insert(body, `${mention} `);
        }
    }
    yield put(commentsScrollToComposer());
}

export function* glanceCommentLoadSaga() {
    const {receiverName, receiverPostingId, commentId, comment} = yield select(
        state => {
            const comments = getCommentsState(state);
            return {
                receiverName: comments.receiverName,
                receiverPostingId: comments.receiverPostingId,
                commentId: comments.glanceCommentId,
                comment: getComment(state, comments.glanceCommentId)
            }
        }
    );

    if (comment != null) {
        yield put(glanceCommentLoaded(receiverName, comment));
        return;
    }

    try {
        const data = yield call(Node.getComment, receiverName, receiverPostingId, commentId);
        yield put(glanceCommentLoaded(receiverName, data));
    } catch (e) {
        yield put(glanceCommentLoadFailed(receiverName, receiverPostingId));
        yield put(errorThrown(e));
    }
}
