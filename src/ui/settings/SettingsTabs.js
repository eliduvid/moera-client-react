import React from 'react';
import { connect } from 'react-redux';

import SettingsTab from "ui/settings/SettingsTab";
import "./SettingsTabs.css";

const SettingsTabs = ({loadingNodeValues, loadingNodeMeta, loadingClientValues}) => (
    <ul className="nav nav-tabs settings-tabs">
        <SettingsTab name="node" title="My Node" href={"/settings/node"} loading={loadingNodeValues || loadingNodeMeta}/>
        <SettingsTab name="client" title="My Client" href={"/settings/client"} loading={loadingClientValues}/>
    </ul>
);

export default connect(
    state => ({
        loadingNodeValues: state.settings.node.loadingValues,
        loadingNodeMeta: state.settings.node.loadingMeta,
        loadingClientValues: state.settings.client.loadingValues
    })
)(SettingsTabs);
