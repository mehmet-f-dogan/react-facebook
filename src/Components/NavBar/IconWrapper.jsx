import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBubble from "../../SharedComponents/NotificationBubble";
import ToolTip from "../../SharedComponents/ToolTip";

function IconWrapper({ children, path, label, handleRefresh }) {
  const [hoverState, setHoverState] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation;
  const handlePath = () => {
    navigate(path);
    handleRefresh();
  };
  return (
    <div
      onClick={handlePath}
      className={location === path ? "active" : "iconWrapper"}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      {children}
      {hoverState && <ToolTip label={label} left="28%" />}
      {location !== path && (
        <NotificationBubble right="31%" top="-2px" number={0} />
      )}
    </div>
  );
}

export default IconWrapper;
