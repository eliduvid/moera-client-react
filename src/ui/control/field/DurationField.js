import React from 'react';
import PropType from 'prop-types';
import { NumberPicker } from 'react-widgets';
import { Field } from 'formik';
import selectn from 'selectn';

import { Column } from "ui/control";
import { FormFieldGroup } from "ui/control/field";
import Duration from "util/duration";
import "./DurationField.css";

const UNITS = [
    {short: "s", long: "seconds"},
    {short: "m", long: "minutes"},
    {short: "h", long: "hours"},
    {short: "d", long: "days"}
];

export class DurationField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        horizontal: PropType.bool,
        groupClassName: PropType.string,
        labelClassName: PropType.string,
        col: PropType.string,
        autoFocus: PropType.bool,
        noFeedback: PropType.bool,
        min: PropType.string,
        max: PropType.string,
        initialValue: PropType.string,
        defaultValue: PropType.string
    };

    onChange = (form, fieldName, newUnit, newAmount) => {
        let duration = Duration.parse(form.values[fieldName]);
        if (newUnit != null) {
            duration.unit = newUnit;
        }
        if (newAmount != null) {
            duration.amount = newAmount;
        }
        form.setFieldValue(fieldName, duration.toString());
    };

    render() {
        const {name, title, horizontal = false, groupClassName, labelClassName, col, noFeedback = false,
               autoFocus, initialValue, defaultValue} = this.props;
        const min = this.props.min != null ? Duration.parse(this.props.min) : Duration.MIN;
        const max = this.props.max != null ? Duration.parse(this.props.max) : Duration.MAX;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const duration = Duration.parse(field.value);
                    const touched = selectn(field.name, form.touched);
                    const error = selectn(field.name, form.errors);
                    return (
                        <FormFieldGroup
                            title={title}
                            name={name + "_amount"}
                            horizontal={horizontal}
                            labelClassName={labelClassName}
                            groupClassName={groupClassName}
                            field={field}
                            form={form}
                            initialValue={initialValue}
                            defaultValue={defaultValue}
                        >
                            {/* <label> is not functional, because NumberPicker doesn't allow to set id */}
                            <Column className={col}>
                                <div className="duration-control">
                                    <NumberPicker
                                        name={field.name + "_amount"}
                                        value={duration.amount}
                                        onChange={v => this.onChange(form, field.name, null, v)}
                                        autoFocus={autoFocus}
                                        min={min.toUnitCeil(duration.unit)}
                                        max={max.toUnitFloor(duration.unit)}
                                    />
                                    <select name={field.name + "_unit"} value={duration.unit}
                                            onChange={e => this.onChange(form, field.name, e.target.value, null)}>
                                        {UNITS.map(({short, long}) => (
                                            max.toSeconds() >= new Duration(1, short).toSeconds() ?
                                                <option key={short} value={short}>{long}</option>
                                            :
                                                null
                                        ))}
                                    </select>
                                </div>
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </Column>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}
