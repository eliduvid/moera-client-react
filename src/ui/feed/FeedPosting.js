import React from 'react';
import { connect } from 'react-redux';

import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingHtml from "ui/posting/PostingHtml";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import Jump from "ui/navigation/Jump";
import { isConnectedToHome } from "state/home/selectors";
import "ui/posting/Posting.css";

const Content = ({posting}) => {
    if (posting.bodyPreview.text) {
        return (
            <div className="content">
                <PostingHtml html={posting.bodyPreview.text}/>
                <p><Jump href={`/post/${posting.id}`}>Continue Reading &rarr;</Jump></p>
            </div>
        );
    } else {
        return (
            <PostingHtml className="content" html={posting.body.previewText}/>
        );
    }
};

const FeedPosting = ({posting, story, deleting, isPermitted, connectedToHome}) => (
    <div className="posting" data-moment={story.moment}>
        {deleting ?
            <PostingDeleting/>
        :
            <>
                <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                <PostingPin pinned={story.pinned}/>
                <div className="owner-line">
                    <PostingOwner posting={posting}/>
                    <PostingDate id={posting.id} publishedAt={story.publishedAt}/>
                    <PostingUpdated posting={posting}/>
                </div>
                <PostingSubject posting={posting} preview={true}/>
                <Content posting={posting}/>
                <PostingReactions posting={posting}/>
                {connectedToHome && <PostingButtons posting={posting}/>}
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    })
)(FeedPosting);