import React from 'react';
import PropType from 'prop-types';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

export const ModalDialog = ({title, size, children, onClose}) => {
    return ReactDOM.createPortal(
        <>
            <div className="modal-backdrop show" />
            <div className="modal show" style={{display: "block"}} onClick={onClose}
                 onKeyDown={e => {
                     if (e.key === "Escape" && onClose) {
                         onClose();
                     }
                 }}>
                <div className={cx(
                            "modal-dialog",
                            "modal-dialog-centered", {
                                [`modal-${size}`]: !!size
                            }
                        )} onClick={e => e.stopPropagation()}>
                    <div className="modal-content">{
                        title &&
                            <div className="modal-header">
                                <h4 className="modal-title">{title}</h4>
                                {onClose && <button type="button" className="close" onClick={onClose}>&times;</button>}
                            </div>
                        }
                        {children}
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("modal-root")
    );
};

ModalDialog.propTypes = {
    title: PropType.string,
    size: PropType.string,
    onClose: PropType.func
};
