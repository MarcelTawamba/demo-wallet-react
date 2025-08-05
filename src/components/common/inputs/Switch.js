import React from 'react';

export const Select = ({ options, onClick, label, show_select, disabled }) => (
  <div
    style={{
      position: 'relative',
      color: disabled ? 'rgb(84, 84, 84)' : null,
      cursor: 'default',
    }}
    className="select-style">
    {show_select ? (
      <div
        style={{
          zIndex: 100001,
          backgroundColor: '#fff',
          boxShadow:
            '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
        }}>
        {options}
      </div>
    ) : (
      <span
        style={{
          fontSize: '20px',
          position: 'absolute',
          bottom: '10px',
        }}
        onClick={!disabled ? onClick : null}>
        {label}
      </span>
    )}
  </div>
);

export const Option = ({ index, label, onClick }) => (
  <option className="list-item" value={index} onClick={onClick}>
    {label}
  </option>
);
