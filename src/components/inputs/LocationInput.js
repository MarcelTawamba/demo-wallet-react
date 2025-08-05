/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { throttle, isEqual } from 'lodash';
import { getPlacePredictions, getPlaceDetails } from 'util/rehive';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Spinner from 'components/outputs/Spinner';
import parse from 'autosuggest-highlight/parse';

export default function LocationInput(props) {
  const { label, onChange, setAwaiting, value, prefix = '' } = props;
  const classes = useStyles();
  const [value_, setValue] = useState(value ?? '');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isEqual(inputValue, value_)) getDetails();
  }, [inputValue]);

  useEffect(() => {
    if (typeof value === 'string') setValue(value);
  }, [value]);

  function handleChange(place) {
    if (!place) {
      if (onChange) onChange(null);
      return;
    }

    let formattedAddress = {
      [`${prefix}line_1`]: [],
      [`${prefix}line_2`]: '',
      [`${prefix}city`]: '',
      [`${prefix}state_province`]: '',
      [`${prefix}country`]: '',
      [`${prefix}postal_code`]: '',
    };

    place.address_components.forEach(item => {
      function contains(term) {
        return item.types.includes(term);
      }

      switch (true) {
        case contains('street_number'):
        case contains('route'):
          formattedAddress[`${prefix}line_1`].push(item.long_name);
          break;
        case contains('neighborhood'):
          formattedAddress[`${prefix}line_2`] = item.long_name;
          break;
        case contains('locality'):
          formattedAddress[`${prefix}city`] = item.long_name;
          break;
        case contains('administrative_area_level_1'):
          formattedAddress[`${prefix}state_province`] = item.long_name;
          break;
        case contains('country'):
          formattedAddress[`${prefix}country`] = item.short_name;
          break;
        case contains('postal_code'):
          formattedAddress[`${prefix}postal_code`] = item.long_name;
          break;
        default:
      }
    });

    formattedAddress[`${prefix}line_1`] = formattedAddress[
      `${prefix}line_1`
    ].join(' ');

    if (onChange) onChange(formattedAddress);
  }

  async function getDetails() {
    const match = options?.find(option => option.description === inputValue);
    if (!match) return handleChange(null);

    setAwaiting(true);
    setFetching(true);

    getPlaceDetails(match.place_id).then(resp => {
      handleChange(resp?.data?.result);
      setAwaiting(false);
      setFetching(false);
    });
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        setLoading(true);

        getPlacePredictions(request.input).then(resp => {
          callback(resp?.data?.predictions);
        });
      }, 200),
    [],
  );

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions(value_ ? [value_] : []);
      setLoading(false);
      return undefined;
    }

    fetch({ input: inputValue }, results => {
      if (active) {
        let newOptions = [];

        if (value_) {
          newOptions = [value_];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value_, inputValue, fetch]);

  return (
    <div style={{ width: '100%' }}>
      <div id={`map_${label}`} style={{ display: 'none' }}></div>
      <Autocomplete
        id={`location_input_${label}`}
        getOptionLabel={option =>
          typeof option === 'string' ? option : option.description
        }
        filterOptions={x => x}
        options={options}
        autoComplete
        autoSelect
        autoHighlight
        // includeInputInList
        noOptionsText={
          inputValue ? 'No options' : 'Begin typing to see suggestions...'
        }
        loading={loading}
        loadingText={<Spinner size={20} />}
        filterSelectedOptions
        value={value_}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            margin="dense"
            fullWidth
          />
        )}
        renderOption={option => {
          if (typeof option === 'string') return;
          const matches =
            option?.structured_formatting?.main_text_matched_substrings;
          const parts = parse(
            option?.structured_formatting?.main_text,
            matches?.map(match => [match.offset, match.offset + match.length]),
          );

          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
      {fetching && (
        <span style={{ fontSize: '0.8rem', lineHeight: 0, color: '#797979' }}>
          Fetching details...
        </span>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));
