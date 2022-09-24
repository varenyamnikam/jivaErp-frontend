import React from 'react'

function popuprollrights(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn">X</button>
                {props.children}
            </div>
        </div>
    ) : "";
}

export default popuprollrights