import React, { useState } from 'react';
import './CollapsibleButton.css'; // Import your CSS file for styling

const CollapsibleButton = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`collapsible-button ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={handleToggle}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      {!isCollapsed && (
        <div className="content">
          {/* Content to display when button is expanded */}
          <button onClick={props.codeb}>Code-block</button>
      <button onClick={props.Table}>Add-Table</button>
      <button onClick = {props.InsertRow}>Add-Row</button>
      
      <button onClick = {props.insertCol}>Add-Col</button>
      <button onClick = {props.DeleteRow}>DeleteRow</button>
      <button onClick = {props.DeleteCol}>DeleteCol</button>
        </div>
      )}
    </div>
  );
};

export default CollapsibleButton;
