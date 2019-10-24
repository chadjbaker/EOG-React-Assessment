import React, { useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { useDispatch } from 'react-redux';
import { Provider, createClient, useQuery } from "urql";
import * as actions from "../store/actions";

const options = ['Houston', 'Dallas', 'San Antonio'];

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const query = `
query($latLong: WeatherQuery!) {
  getWeatherForLocation(latLong: $latLong) {
    description
    locationName
    temperatureinCelsius
  }
}
`;

export default () => {
  return (
    <Provider value={client}>
      <SplitButton />
    </Provider>
  );
};

const SplitButton = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const dispatch = useDispatch();
  
  // Default to houston
  const latLong = {
    latitude: 29.7604,
    longitude: -95.3698
  };

  if(selectedIndex === 1){
    latLong.latitude = 32.7767
    latLong.longitude = -96.7970
  } 
  if (selectedIndex === 2){
    latLong.latitude = 29.4241
    latLong.longitude = -98.4936
  }

  const [result] = useQuery({
    query,
    variables: {
      latLong
    },
    pollInterval:1500,
    requestPolicy: 'network-only'
  });

  const { data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getWeatherForLocation } = data;
      dispatch({ type: actions.WEATHER_DATA_RECEIVED, getWeatherForLocation });
    },
    [dispatch, data, error]
  );
  
  const handleClick = () => {
    alert(`You clicked ${options[selectedIndex]}`);
    dispatch({ type: actions.INDEX_RECEIVED, selectedIndex });
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
      <Grid container>
        <Grid item xs={12} align="center">
          <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <Button
              color="primary"
              size="small"
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper id="menu-list-grow">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 3}
                          selected={index === selectedIndex}
                          onClick={event => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
        <br/>
        <br/>
        <br/>
        <br/>
      </Grid>
      
  );
}