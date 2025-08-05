import React from 'react';

export default function Content({ item: { id, title, state } }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
