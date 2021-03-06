import React from 'react';
import { connect } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeMessageBox } from "state/messagebox/actions";

const forwardAction = (action) => action;

class MessageBox extends React.PureComponent {

    onClose = () => {
        const {closeMessageBox, onClose, forwardAction} = this.props;

        closeMessageBox();
        if (onClose) {
            if (typeof(onClose) === "function") {
                onClose();
            } else {
                forwardAction(onClose);
            }
        }
    };

    render() {
        const {show, message} = this.props;

        return (
            show &&
                <ModalDialog onClose={this.onClose}>
                    <div className="modal-body">
                        {message}
                    </div>
                    <div className="modal-footer">
                        <Button variant="primary" onClick={this.onClose} autoFocus>OK</Button>
                    </div>
                </ModalDialog>
        );
    }

}

export default connect(
    state => state.messageBox,
    { closeMessageBox, forwardAction }
)(MessageBox);
