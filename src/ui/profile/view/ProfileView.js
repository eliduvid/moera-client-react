import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import NodeNameView from "ui/profile/view/NodeNameView";
import { profileEdit } from "state/profile/actions";
import { isProfileEditable } from "state/profile/selectors";
import "./ProfileView.css";

const EditButtonImpl = ({profileEdit}) => (
    <Button variant="outline-primary" size="sm" style={{marginLeft: "1rem"}} onClick={profileEdit}>
        Edit
    </Button>
);

const EditButton = connect(
    null,
    {profileEdit}
)(EditButtonImpl);

const ProfileLine = ({title, children, visible = true}) => (
    visible &&
        <>
            <dt className="col-sm-2">{title}</dt>
            <dd className="col-sm-10">{children}</dd>
        </>
);

ProfileLine.propTypes = {
    title: PropType.string,
    visible: PropType.bool
};

const ProfileView = ({loading, fullName, gender, email, editable}) => (
    <>
        <h2>Profile</h2>
        <div className="profile-view">
            <NodeNameView />
            <br />
            <br />
            <h4>
                Details <Loading active={loading} />
                {editable && <EditButton />}
            </h4>
            <dl className="row">
                <ProfileLine title="Full name" visible={!!fullName}>
                    {fullName}
                </ProfileLine>
                <ProfileLine title="Gender" visible={!!gender}>
                    {gender}
                </ProfileLine>
                <ProfileLine title="E-mail" visible={!!email}>
                    <a href={`mailto:${email}`}>{email}</a>
                </ProfileLine>
            </dl>
        </div>
    </>
);

ProfileView.propTypes = {
    loading: PropType.bool,
    fullName: PropType.string,
    gender: PropType.string,
    email: PropType.string,
    editable: PropType.bool
};

export default connect(
    state => ({
        ...state.profile,
        editable: isProfileEditable(state)
    })
)(ProfileView);
