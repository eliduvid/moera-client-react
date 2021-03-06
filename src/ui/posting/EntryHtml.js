import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { getNamingNameDetails } from "state/naming/selectors";
import { urlWithParameters } from "util/misc";
import { getSetting } from "state/settings/selectors";
import { isConnectedToHome } from "state/home/selectors";

class EntryHtml extends React.PureComponent {

    static propTypes = {
        className: PropType.string,
        html: PropType.string
    };

    #dom;

    render() {
        const {className, html, fontMagnitude} = this.props;

        return <div ref={dom => this.#dom = dom} className={className} style={{fontSize: `${fontMagnitude}%`}}
                    dangerouslySetInnerHTML={{__html: html}} />
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {homePageRoot, getNameDetails} = this.props;

        this.#dom.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const details = getNameDetails(name);
            const href = details.loaded
                ? details.nodeUri : urlWithParameters(homePageRoot + "/gotoname", {name});
            node.setAttribute("href", href);
        });
    }

}

export default connect(
    state => ({
        homePageRoot: isConnectedToHome(state) ? state.home.root.page : state.node.root.page,
        getNameDetails: name => getNamingNameDetails(state, name),
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    })
)(EntryHtml);
