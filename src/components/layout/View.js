import React from 'react';
// import './common.css';
import PropTypes from 'prop-types';
import { useTheme } from 'components/app/context';

const View = ({
  style = null,
  children = [],
  p = 0,
  ph = null,
  pt = null,
  pb = null,
  pl = null,
  pr = null,
  pv = null,
  m = 0,
  mv = null,
  mh = null,
  mb = null,
  mt = null,
  mr = null,
  ml = null,
  o = 1,
  h = null,
  w = null,
  d,
  columns,
  flex,
  row,
  fD = 'column',
  flexGrow = 0,
  jC = null,
  aI = null,
  bC = null,
  border,
  borderColor,
  bR = 0,
  gap,
  grid,
  gridCols,
  ...restProps
}) => {
  const rem = 16;
  const { colors } = useTheme();

  const styled = {
    paddingTop: (pt || pt === 0 ? pt : pv ? pv : p ? p : 0) * rem,
    paddingBottom: (pb || pb === 0 ? pb : pv ? pv : p ? p : 0) * rem,
    paddingLeft: (pl || pl === 0 ? pl : ph ? ph : p ? p : 0) * rem,
    paddingRight: (pr || pr === 0 ? pr : ph ? ph : p ? p : 0) * rem,
    marginTop: (mt || mt === 0 ? mt : mv ? mv : m ? m : 0) * rem,
    marginBottom: (mb || mb === 0 ? mb : mv ? mv : m ? m : 0) * rem,
    marginLeft: (ml || ml === 0 ? ml : mh ? mh : m ? m : 0) * rem,
    marginRight: (mr || mr === 0 ? mr : mh ? mh : m ? m : 0) * rem,
    opacity: o,
    height: h,
    width: w,
    backgroundColor: bC ? (colors[bC] ? colors[bC] : bC) : 'transparent',
    border: border ? `1px solid ${colors[borderColor ?? 'font']}` : '',
    borderRadius: bR ? bR : 0,
    display: grid ? 'grid' : flex || fD ? 'flex' : '',
    gap: gap ? `${gap * rem}px` : '',
    gridTemplateColumns: gridCols
      ? `repeat(${gridCols}, minmax(0, 1fr))`
      : columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : 'none',
    flexDirection: fD ? fD : 'column',
    flexGrow: flexGrow ? 1 : 0,
    justifyContent: grid ? '' : jC ?? 'flex-start',
    alignItems: aI ? aI : 'flex-start',
    ...style,
  };
  return (
    <div style={styled} {...restProps}>
      {children}
    </div>
  );
};

View.propTypes = {
  // keyboardAvoiding: PropTypes.bool,
  // scrollView: PropTypes.bool,

  behavior: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]), // string passed to RN <Text />
  f: PropTypes.number, // flex
  h: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // height
  w: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // width
  m: PropTypes.number, // margin
  mv: PropTypes.number, // margin vertical
  mh: PropTypes.number, // margin horizontal
  p: PropTypes.number, // padding
  pv: PropTypes.number, // padding vertical
  ph: PropTypes.number, // padding horizontal
  o: PropTypes.number, // opacity
  bC: PropTypes.string, // backgroundColor
  hC: PropTypes.string, // headerColor
  // bR: PropTypes.number, // borderRadius
  colors: PropTypes.object, // colors object from context
  rem: PropTypes.number, // rem value
  fD: PropTypes.string, // flexDirection
  aI: PropTypes.string, // alignItems
  jC: PropTypes.string, // justifyContent
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // TODO: ViewPropTypes.style, // override text style
  // header: PropTypes.bool, // TODO: ViewPropTypes.style, // override text style
};

export { View };
