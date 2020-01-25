import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getSetting } from "state/settings/selectors";

const PostingUpdated = ({posting, timeRelative}) => {
    if (posting.totalRevisions <= 1) {
        return null;
    }

    const date = moment.unix(posting.editedAt);
    return (
        <span className="date">
            {" "}(updated {
                timeRelative ?
                    <abbr title={date.format("DD-MM-YYYY HH:mm")}>{date.fromNow()}</abbr>
                :
                    date.format("DD-MM-YYYY HH:mm")
            })
        </span>
    );
};

export default connect(
    state => ({
        timeRelative: getSetting(state, "posting.time.relative")
    })
)(PostingUpdated);