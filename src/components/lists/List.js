import React from 'react';

const List = ({ renderItem, data, ...restProps }) => {
  return (
    <React.Fragment>
      {data.map((item, index) => renderItem({ item, index }))}
    </React.Fragment>
  );
};

export default List;
