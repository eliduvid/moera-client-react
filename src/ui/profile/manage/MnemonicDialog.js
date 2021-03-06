import React from 'react';
import { connect } from 'react-redux';
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";
import { Form, withFormik } from 'formik';

import { mnemonicClose } from "state/nodename/actions";

const Column = ({mnemonic, start, end}) => (
    <div className="col-sm-4">
        <ol start={start + 1}>
            {mnemonic.slice(start, end).map((value, index) => (<li key={index}>{value}</li>))}
        </ol>
    </div>
);

class MnemonicDialog  extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.mnemonic != null && prevProps.mnemonic == null) {
            this.props.resetForm();
        }
    }

    render() {
        const {name, mnemonic} = this.props;
        const {confirmed} = this.props.values;

        if (!mnemonic) {
            return null;
        }

        return (
            <ModalDialog title="Registered Name Secret">
                <Form>
                    <div className="modal-body">
                        <p>
                            Please write down or print these words and keep them in a safe place. You will need them for
                            any operations with the name ‘{name}’. <b>If you loose these words, they cannot be recovered
                            and you will completely loose control of your registered name.</b>
                        </p>
                        <div className="row">
                            <Column mnemonic={mnemonic} start={0} end={8} />
                            <Column mnemonic={mnemonic} start={8} end={16} />
                            <Column mnemonic={mnemonic} start={16} end={24} />
                        </div>
                        <CheckboxField name="confirmed" title="I have written down all these words" />
                    </div>
                    <div className="modal-footer">
                        <Button variant="primary" type="submit" disabled={!confirmed}>Close</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const mnemonicDialogLogic = {

    mapPropsToValues(props) {
        return {
            confirmed: false
        }
    },

    handleSubmit(values, formik) {
        formik.props.mnemonicClose();
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        name: state.nodeName.mnemonicName,
        mnemonic: state.nodeName.mnemonic,
    }),
    { mnemonicClose }
)(withFormik(mnemonicDialogLogic)(MnemonicDialog));
