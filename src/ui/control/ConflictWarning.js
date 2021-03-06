import React from 'react';
import PropType from 'prop-types';

export const ConflictWarning = ({text, show, onClose}) => (
    show &&
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {text}
            <button type="button" className="close" aria-label="Close">
                <span aria-hidden="true" onClick={onClose}>&times;</span>
            </button>
        </div>
);

ConflictWarning.propTypes = {
    title: PropType.string,
    show: PropType.bool,
    onClose: PropType.func
};
