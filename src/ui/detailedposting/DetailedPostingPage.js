import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Page } from "ui/page/Page";
import { Loading } from "ui/control";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import "./DetailedPostingPage.css";

const DetailedPostingPage = ({loading, deleting, posting}) => {
    return (
        <Page className="mt-3">
            {posting && <DetailedPosting posting={posting} deleting={deleting}/>}
            {!posting && loading &&
                <div className="posting">
                    <Loading active={loading}/>
                </div>
            }
            {!posting && !loading &&
                <div className="posting-not-found">
                    <FontAwesomeIcon className="icon" icon="frown" size="3x"/>
                    <div className="message">Posting not found or cannot be displayed.</div>
                </div>
            }
        </Page>
    );
};

export default connect(
    state => ({
        loading: state.detailedPosting.loading,
        deleting: isDetailedPostingBeingDeleted(state),
        posting: getDetailedPosting(state)
    })
)(DetailedPostingPage);
