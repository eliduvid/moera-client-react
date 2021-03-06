import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';

import SettingsField from "ui/settings/SettingsField";
import SettingsButtons from "ui/settings/SettingsButtons";
import { SettingTypes } from "api";
import { messageBox } from "state/messagebox/actions";
import { settingsUpdate } from "state/settings/actions";

import "./SettingsSheetAutomatic.css";

function toFieldName(name) {
    return name.replace(/\./g, "_");
}

class SettingsSheetAutomatic extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = { sheetMaxHeight: "none" };
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize);
        this.setState({ sheetMaxHeight: this._calcListMaxHeight() });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        this.setState({ sheetMaxHeight: this._calcListMaxHeight() });
    };

    _calcListMaxHeight() {
        const sheetElement = document.getElementsByClassName("settings-sheet").item(0);
        if (sheetElement == null) {
            return "none";
        }
        const buttonsElement = document.getElementsByClassName("settings-buttons").item(0);
        if (buttonsElement == null) {
            return "none";
        }
        const topHeight = sheetElement.getBoundingClientRect().top + window.scrollY;
        const bottomHeight = buttonsElement.getBoundingClientRect().height + 10;
        const maxHeight = window.innerHeight - topHeight - bottomHeight;
        return `${maxHeight}px`;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((this.props.valuesMap.size > 0) !== (prevProps.valuesMap.size > 0))
            || ((this.props.metaMap.size > 0) !== (prevProps.metaMap.size > 0))) {

            this.props.resetForm({
                values: settingsSheetOtherLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {valuesMap, metaMap} = this.props;

        return (
            <Form>
                <div className="settings-sheet" style={{maxHeight: this.state.sheetMaxHeight}}>
                    {[...metaMap.keys()].sort().map(name => {
                        const meta = metaMap.get(name);
                        let initialValue = valuesMap.get(name);
                        initialValue = initialValue ? initialValue : meta.defaultValue;
                        return <SettingsField key={name} name={name} fieldName={toFieldName(name)} meta={meta}
                                              initialValue={initialValue}/>
                    })}
                </div>
                <SettingsButtons />
            </Form>
        );
    }

}

const settingsSheetOtherLogic = {

    mapPropsToValues(props) {
        const {valuesMap, metaMap} = props;

        if (metaMap.size === 0) {
            return {};
        }

        let values = {};
        metaMap.forEach((meta, name) => {
            let value = valuesMap.get(name);
            value = value ? value : meta.defaultValue;
            values[toFieldName(name)] = SettingTypes.toValue(meta.type, value);
        });
        return values;
    },

    handleSubmit(values, formik) {
        const {valuesMap, metaMap, messageBox, settingsUpdate} = formik.props;

        if (metaMap.size === 0) {
            formik.setSubmitting(false);
            return;
        }

        let hasErrors = false;
        let settingsToUpdate = [];
        metaMap.forEach((meta, name) => {
            const fieldName = toFieldName(name);
            let value = values[fieldName];
            const valid = SettingTypes.validate(value, meta.type, meta.modifiers);
            if (valid !== true) {
                formik.setFieldError(fieldName, valid);
                hasErrors = true;
            } else {
                formik.setFieldError(fieldName, null);
                value = value.toString(); // FIXME SettingTypes.toString(value) may be needed
                if (valuesMap.get(name) !== value) {
                    settingsToUpdate.push({name, value});
                }
            }
        });

        if (hasErrors) {
            messageBox("Some settings have incorrect values.");
        } else {
            settingsUpdate(settingsToUpdate);
        }

        formik.setSubmitting(false);
    }

};

export default connect(
    null,
    { messageBox, settingsUpdate }
)(withFormik(settingsSheetOtherLogic)(SettingsSheetAutomatic));
