import React from "react";
import { useNavigate } from "react-router-dom";

import NotificationBubble from "../../SharedComponents/NotificationBubble";
import ToolTip from "../../SharedComponents/ToolTip";
function IconWrapperCircle({
  children,
  label,
  icon,
  path,
  number,
  childVisibility,
}) {
  const [hoverState, setHoverState] = React.useState(false);
  const navigate = useNavigate();
  const handleMenu = (e) => {
    setHoverState(false);
    path && navigate(path);
  };
  return (
    <div
      className="iconWrapper-2 flexBox"
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onClick={handleMenu}
    >
      {icon}
      {children}
      {!childVisibility && hoverState && <ToolTip label={label} />}
      <NotificationBubble
        numberVisibility={label === "Messenger"}
        height={label === "Messenger" ? "12px" : "18px"}
        width={label === "Messenger" ? "12px" : "18px"}
        top={label === "Messenger" ? "0" : "-5px"}
        right={label === "Messenger" ? "0" : "-3px"}
        number={number}
      />
    </div>
  );
}

export default IconWrapperCircle;
