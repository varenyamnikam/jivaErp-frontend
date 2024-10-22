import React, { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";

function Dropdown(props) {
  const [visible, setVisibility] = useState(false);

  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );
  useEffect(() => {
    // listen for clicks and close dropdown on body
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  function handleDocumentClick(event) {
    if (referenceRef.current.contains(event.target)) {
      return;
    }
    setVisibility(false);
  }
  function handleDropdownClick(event) {
    setVisibility(!visible);
  }

  return (
    <React.Fragment>
      <button ref={referenceRef} onClick={handleDropdownClick}>
        Click Me
      </button>
      <div ref={popperRef} style={styles.popper} {...attributes.popper}>
        <DropdownContainer style={styles.offset} visible={visible}>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
          <DropdownItem>Element</DropdownItem>
        </DropdownContainer>
      </div>
    </React.Fragment>
  );
}

const DropdownContainer = styled.div`
  display: ${(props) => (props.visible ? "flex" : "none")};
  width: "2px";
  flex-direction: column;
  background-color: "#FFF";
  border-radius: 4px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.14);
  padding: 5px;
`;

const DropdownItem = styled.div`
  justify-content: flex-start;
  height: 40px;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;

  &:hover {
    background-color: #00ffff;
  }
  &:active {
    font-weight: 700;
    color: #00ffff;
  }
`;

export default Dropdown;
