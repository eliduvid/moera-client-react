import React from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';

import VerticalMenu from "ui/mainmenu/vertical/VerticalMenu";
import "./VerticalMenuToggler.css";

class VerticalMenuToggler extends React.PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {visible: false};
    }

    toggle = () => {
        if (!this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
    };

    documentClick = event => {
        for (let element of document.querySelectorAll(".vertical-menu").values()) {
            const r = element.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return;
            }
        }
        this.hide();
    };

    show = () => {
        if (this.state.visible) {
            return;
        }
        this.setState({visible: true});
        document.addEventListener("click", this.documentClick);
    };

    hide = () => {
        if (!this.state.visible) {
            return;
        }
        this.setState({visible: false});
        document.removeEventListener("click", this.documentClick);
    };

    render() {
        const {visible} = this.state;

        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <button ref={ref} className="navbar-toggler" type="button" onClick={this.toggle}>
                            <span className="navbar-toggler-icon"/>
                        </button>
                    )}
                </Reference>
                {ReactDOM.createPortal(
                    visible &&
                        <Popper placement="bottom" positionFixed={true}>
                            {({ref, style, placement, arrowProps, forceUpdate}) => (
                                <div ref={ref} style={style} className="vertical-menu-popper">
                                    <VerticalMenu/>
                                </div>
                            )}
                        </Popper>,
                    document.querySelector("#modal-root")
                )}
            </Manager>
        );
    }

}

export default VerticalMenuToggler;
