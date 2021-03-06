import React from 'react';
import { connect } from 'react-redux';

import { Page } from "ui/page/Page";
import ProfileView from "ui/profile/view/ProfileView";
import ProfileEditor from "ui/profile/edit/ProfileEditor";

const ProfilePage = ({editing}) => (
    <Page className="mt-3">
        {!editing && <ProfileView />}
        {editing && <ProfileEditor />}
    </Page>
);

export default connect(
    state => ({
        editing: state.profile.editing
    })
)(ProfilePage);
