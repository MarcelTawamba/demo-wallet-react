import React from 'react';
import ReactJson from 'react-json-view';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { getName } from 'country-list';
import { formatTime, standardizeString } from 'util/general';
import { formatAmountString } from 'util/general';
import Text from 'components/outputs/Text';
import Output from 'components/outputs/Output';
import OutputList from '../lists/OutputList';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    width: '100%',
  },
  component: {
    width: '100%',
    height: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 650,
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
  },
  section: {
    width: '100%',
    padding: theme.spacing(2),
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    // display: 'flex',
    marginBottom: theme.spacing(2),
    // flexDirection: 'column',
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const TableComponent = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.component}>{children}</div>;
};

export default function OutputTable(props) {
  const { fields, item, sections, renderFooter = () => {} } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {sections.map(section => (
        <OutputSection item={item} section={section} />
      ))}
      {/* <div className={classes.container}>
        <TableContainer component={TableComponent}>
          <MuiTable
            className={classes.table}
            size="small"
            aria-label="product table">
            <TableBody>
              {fields.map(field => (
                <OutputTableRow
                  key={field.id}
                  value={get(item, field.id)}
                  {...field}
                />
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>

        {renderFooter ? renderFooter(props) : null}
      </div> */}
    </div>
  );
}

function OutputSection(props) {
  const { item, section } = props;
  let { id, label, fields } = section;
  if (!label) label = standardizeString(id);

  const classes = useStyles();
  const half = Math.ceil(fields.length / 2);
  const outputs = fields.map(field => {
    return { ...field, value: get(item, field.value) };
  });

  const firstHalf = outputs.splice(0, half);
  const secondHalf = outputs.splice(-half);

  return (
    <div className={classes.section}>
      <Text variant="h5">{label}</Text>
      <div className={classes.columns}>
        <OutputList
          items={firstHalf}
          outputProps={{ placeholder: 'Not yet provided' }}
        />
        <OutputList
          items={secondHalf}
          outputProps={{ placeholder: 'Not yet provided' }}
        />
      </div>
    </div>
  );
}

function OutputTableRow(props) {
  let { type = '', label, value } = props;

  if (!value) {
    return '';
  }
  if (type === 'boolean') {
    value = value ? 'Yes' : 'No';
  } else if (type.match(/array|country|prices/)) {
    if (type === 'country') {
      value = value.map(item => getName(item));
    } else if (type === 'prices') {
      value = value.map(item =>
        formatAmountString(item.amount, item.currency, true),
      );
    }
    value = value.join(', ').toString();
  } else if (type.match(/date/)) {
    value = formatTime(value, 'MMM Do YYYY, h:mm A');
  } else if (type.match(/standardise/)) {
    value = standardizeString(value);
  } else if (type.match(/json/)) {
    value = (
      <ReactJson
        src={value}
        theme="bright:inverted"
        enableClipboard={false}
        displayDataTypes={false}
        displayObjectSize={false}
        name={false}
        iconStyle="triangle"
      />
    );
  }
  // else if (type.match(/prices/)) {
  //   console.log("OutputTableRow -> value", value)
  //       value = formatTime(value, 'MMMM Do YYYY, h:mm:ss a');
  // }
  // console.log('OutputTableRow -> value', value);

  const cellProps = {
    // padding: 'none',
    // style: { borderBottom: 'none', paddingTop: 6, paddingBottom: 6 },
  };

  return (
    <TableRow key={label} hover>
      <TableCell {...cellProps}>{label}</TableCell>
      <TableCell {...cellProps}>{value}</TableCell>
    </TableRow>
  );
}
