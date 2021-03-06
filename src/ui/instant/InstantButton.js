import React from 'react';
import { connect } from 'react-redux';

import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import Instants from "ui/instant/Instants";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";

class InstantButton extends React.PureComponent {

    #visible;

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.viewAll();
    }

    onToggle = (visible) => {
        this.#visible = visible;
        this.viewAll();
    }

    viewAll() {
        const {stories, feedStatusUpdate} = this.props;

        if (!this.#visible || stories == null || stories.length === 0 || stories[0].viewed) {
            return;
        }
        feedStatusUpdate(":instant", true, null, stories[0].moment);
    }

    render() {
        return (
            <Popover element={InstantBell} className="instant-popover" detached={true} onToggle={this.onToggle}>
                {({hide}) => (
                    <Instants hide={hide}/>
                )}
            </Popover>
        );
    }

}

export default connect(
    state => ({
        stories: getFeedState(state, ":instant").stories
    }),
    { feedStatusUpdate }
)(InstantButton);
