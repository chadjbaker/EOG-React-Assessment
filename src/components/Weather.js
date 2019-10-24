import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";
import { Provider, createClient, useQuery } from "urql";
import { useGeolocation } from "react-use";
import LinearProgress from "@material-ui/core/LinearProgress";
import Chip from "./Chip";

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

const getWeather = state => {
  const { temperatureinFahrenheit, description, locationName, index } = state.weather;
  return {
    temperatureinFahrenheit,
    description,
    locationName,
    index
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Weather />
    </Provider>
  );
};

const Weather = () => {
  const getLocation = useGeolocation();
  
  const dispatch = useDispatch();
  const { temperatureinFahrenheit, description, locationName, index } = useSelector(
    getWeather
  );

  // Default to houston
  const latLong = {
      latitude: 29.7604,
      longitude: -95.3698
  };

  const [result] = useQuery({
    query,
    variables: {
      latLong
    },
    pollInterval:1500,
    requestPolicy: 'network-only'
  });

  const { fetching, data, error } = result;
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

  if (fetching) return <LinearProgress />;
  
  return (
    <Chip
      label={`Weather in ${locationName}: ${description} and ${temperatureinFahrenheit}°`}
    />
  );
};
