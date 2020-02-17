import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { NodeName as NodeNameParser } from "api";
import { urlWithParameters } from "util/misc";
import { getNamingNameDetails } from "state/naming/selectors";
import "./NodeName.css";

const NameGeneration = ({generation, latest}) => (
    latest || <span className="generation">{generation}</span>
);

NameGeneration.propTypes = {
    generation: PropType.number,
    latest: PropType.bool
};

const NodeNameImpl = ({ name, verified = false, correct = false, linked = true, homePageRoot, details }) => {
    if (!name) {
        return null;
    }

    const klass = cx(
        "node-name", {
            "correct": verified && correct,
            "incorrect": verified && !correct
        }
    );
    let href = "";
    if (linked) {
        href = details.loaded ? details.nodeUri : urlWithParameters(homePageRoot + "/gotoname", {name});
    }
    const parts = NodeNameParser.parse(name);
    return href ?
        (
            <a className={klass} href={href}>
                {parts.name}
                <NameGeneration generation={parts.generation} latest={details.latest} />
            </a>
        )
        :
        (
            <span className={klass}>
                {parts.name}
                <NameGeneration generation={parts.generation} latest={details.latest} />
            </span>
        );
};

NodeNameImpl.propTypes = {
    name: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool
};

export const NodeName = connect(
    (state, ownProps) => ({
        homePageRoot: state.home.root.page,
        details: getNamingNameDetails(state, ownProps.name)
    })
)(NodeNameImpl);
