import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const getWeather = state => {
  const { temperatureinFahrenheit, temperatureinCelsius, description, locationName } = state.weather;
  return {
    temperatureinFahrenheit,
    temperatureinCelsius,
    description,
    locationName,
  };
};

let ray = [];

const Charts = () => {
  const { temperatureinFahrenheit, temperatureinCelsius } = useSelector(
    getWeather
  );

  const getDataFromProp = (ray) => {
    const rightNow = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

    const obj = {
      name: rightNow,
      F: temperatureinFahrenheit,
      C: temperatureinCelsius, 
      amt: 0,
    }

    ray.push(obj);

    if(ray.length >= 7){
      ray.shift();
    }

    return ray;
  }

  ray = getDataFromProp(ray)

  return (
    <LineChart
      width={700}
      height={300}
      data={getDataFromProp(ray)}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="C" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="F" stroke="#82ca9d" />
    </LineChart>
  );
}

export default Charts;