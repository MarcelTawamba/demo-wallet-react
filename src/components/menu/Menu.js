import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

const Menu = ({ children, title, style }) => {
  return (
    <List
      subheader={
        title && <ListSubheader component="div">{title}</ListSubheader>
      }
      component="nav"
      style={{ ...style, width: '100%' }}>
      {children}
    </List>
  );
};

// const Menu = ({ children }) => {
//   return (
//     <StickyContainer>
//       {/* Other elements can be in between `StickyContainer` and `Sticky`,
//   but certain styles can break the positioning logic used. */}
//       <Sticky>
//         {({
//           style,

//           // the following are also available but unused in this example
//           isSticky,
//           wasSticky,
//           distanceFromTop,
//           distanceFromBottom,
//           calculatedHeight,
//         }) => (
//           <List component="nav" style={style}>
//             {children}
//           </List>
//         )}
//       </Sticky>
//     </StickyContainer>
//   );
// };

export default Menu;
