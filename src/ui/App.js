import React from 'react';

import Storage from "ui/storage/Storage";
import HomeEvents from "ui/events/HomeEvents";
import NodeEvents from "ui/events/NodeEvents";
import ReceiverEvents from "ui/events/ReceiverEvents";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import MainMenu from "ui/mainmenu/MainMenu";
import CurrentPage from "ui/page/CurrentPage";
import ReactionsDialog from "ui/reactionsdialog/ReactionsDialog";
import ChangeDateDialog from "ui/changedatedialog/ChangeDateDialog";
import MessageBox from "ui/messagebox/MessageBox";
import ConfirmBox from "ui/confirmbox/ConfirmBox";
import FlashBox from "ui/flashbox/FlashBox";
import "./colors.css";
import "./App.css";


const App = () => (
    <>
        <Storage/>
        <HomeEvents/>
        <NodeEvents/>
        <ReceiverEvents/>
        <Navigation/>
        <ErrorPane/>
        <MainMenu/>
        <CurrentPage/>
        <ReactionsDialog/>
        <ChangeDateDialog/>
        <MessageBox/>
        <ConfirmBox/>
        <FlashBox/>
    </>
);

export default App;
