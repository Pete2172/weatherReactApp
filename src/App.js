import React, { useState, useEffect } from 'react';
import './App.css';
import CityWeather from './CityWeather';
import SearchBar from './SearchBar';
import uniqid from 'uniqid';



function App() {
  // state hooks
  const [location, setLocation] = useState({city: ""});
  const [cities, setCities] = useState(JSON.parse(localStorage.getItem('cities')) || []);

  // find user's location
  
  async function downloadLocation(){
    const response = await fetch("http://ip-api.com/json/");
    const respJSON = await response.json();

    setLocation({...respJSON, id: uniqid()});
  }

  useEffect(()=>{
    downloadLocation();
  }, [location]);
  
  // saving list of cities to a local storage
  useEffect(() => {
      localStorage.setItem('cities', JSON.stringify(cities));
  }, [cities]);

  // deleting city's weather tab
  function deletePage(id_city){

      setCities(cities.filter(
        e => {
          return (e.id !== id_city) ? e : null ;
        }
      ));
  }

  function isCityOnTheList(val){
    if(String(location.city).toUpperCase() === String(val).toUpperCase()){
      return true;
    }
    else{
      let isOn = false;
      cities.map( e => {
        isOn = (e.city === String(val).toUpperCase()) ? true : false;
      });
      return isOn;
    }
  }

  function getCity(val){

    if(isCityOnTheList(val)){
      alert("This location is already added to the list!");
    }
    else{
     setCities([
        ...cities,
        {id: `${uniqid()}`, city: String(val).toUpperCase(), locate: false}
      ]);
    }
  }

  const searcher = <header><SearchBar addCity = {e => getCity(e)}/></header>

  const listOfCities = cities.map( e => {
    return (
      <div key={e.id} className="cityTab"><CityWeather loc = {e.locate} cityName = {e.city} id = {e.id} deletePageEvent = {e => deletePage(e)} /></div>
    );
  });

  const locationComp = <div key={location.org} className="cityTab"><CityWeather loc = {true} cityName = {String(location.city).toUpperCase()} id = {location.id} deletePageEvent = {e => deletePage(e)} /></div>;

  return (
    <div className="App">
      {searcher}
      <div className="citiesList">
        {locationComp}
        {listOfCities}
      </div>
    </div>
  );
}

export default App;
