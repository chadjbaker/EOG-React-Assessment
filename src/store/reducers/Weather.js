import * as actions from "../actions";

const initialState = {
  temperatureinCelsius: null,
  temperatureinFahrenheit: null,
  description: "",
  locationName: "",
  index: 0
};

const toF = c => (c * 9) / 5 + 32;

const weatherDataRecevied = (state, action) => {
  const { getWeatherForLocation } = action;
  const {
    description,
    locationName,
    temperatureinCelsius
  } = getWeatherForLocation;

  return {
    temperatureinCelsius,
    temperatureinFahrenheit: toF(temperatureinCelsius),
    description,
    locationName
  };
};

const indexReceived = (state, action) => {
  const { selectedIndex } = action;
  
  return {
    temperatureinCelsius: initialState.temperatureinCelsius,
    temperatureinFahrenheit: initialState.temperatureinFahrenheit,
    description: initialState.description,
    locationName: initialState,
    index: selectedIndex
  };
}

const handlers = {
  [actions.WEATHER_DATA_RECEIVED]: weatherDataRecevied,
  [actions.INDEX_RECEIVED]: indexReceived
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;

  return handler(state, action);
};
