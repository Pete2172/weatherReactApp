import React, {useState, useEffect} from 'react';
import './CityWeather.css';
import PropTypes from 'prop-types';
import {TiDelete} from 'react-icons/ti';
import {MdLocationOn} from 'react-icons/md';
import {GiSunset, GiSunrise, GiStrikingArrows} from 'react-icons/gi';
import uniqid from 'uniqid';



function CityWeather(props){    /// props.city, props.deleteEventPage, props.loc, props.id

        // initializing first weather state
        const [weather, setWeather] = useState({cod: "-100", weather:[{main: "", icon:""}], main: {temp: "", humidity: "", pressure: ""}, dt: "", sys: {country: "", surise: "", sunset: ""}, wind: {speed:"", deg: 0}});
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        async function downloadData() {
            const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${props.cityName}&APPID=6b3faa1cc7ff27120415d4457bd66029`);
        
            const respJSON = await resp.json();
            if(respJSON.cod === "404"){
                alert(respJSON.message);
                props.deletePageEvent(props.id);
            }
            else{
                setWeather(respJSON);
            }
        };
        
        useEffect(() => {
            const interval = setInterval(()=>{
                    downloadData();
            }, (weather.cod === "-100") ? 1000 : 3600000);

            return () => clearInterval(interval);
        }); 

        function convertTimestamp(timestamp){
            let date = new Date(timestamp*1000);
            return days[date.getDay()] + ", " + date.toLocaleTimeString().substring(0, 5);
        }

        function convertWindSpeed(){
            // changing m/s to km/h
            return parseInt(weather.wind.speed*3600/1000, 10);
        }

        // html elements
        const params =  <div className="params">
                            <div className="lab">
                                <div><b>Pressure:</b></div>
                                <div>{weather.main.pressure} hPa</div>
                            </div>
                            <div className="lab">
                                {parseInt(weather.main.temp - 273, 10)}°C
                            </div>
                            <div className="lab">
                                <div><b>Humidity:</b></div>
                            <div>{weather.main.humidity} %</div>
                            </div>
                        </div>

        const weatherstate =  weather.weather.map(e => {
            let index = uniqid();
            return (                   
                            <div key={index} className="weatherState">
                                <div className="weatherState__lab">
                                   {e.main}
                                </div>
                                <div className="weatherState__lab">
                                    <img src={`https://openweathermap.org/img/w/${e.icon}.png`} />
                                </div>
                            </div>
        );});

        const sunset = <div className="params"> 
                            <div className="lab">
                                <GiSunset size={50}/>
                            </div>
                            <div className="lab">
                            <div><b>Sunset:</b></div>
                             <div>{convertTimestamp(weather.sys.sunset)}</div>
                             </div>
                            </div>

        const sunrise = <div className="params"> 
                            <div className="lab">
                                 <GiSunrise size={50}/>
                            </div>
                            <div className="lab">
                                <div><b>Sunrise:</b></div>
                                 <div>{convertTimestamp(weather.sys.sunrise)}</div>
                            </div>
                        </div>

        const wind = <div className="params">
                <div className="lab">
                    <GiStrikingArrows size={50} style={{transform: `rotate(${45 + weather.wind.deg}deg)`}} />
                </div>
                <div className="lab">
                        <div><b>Wind speed:</b></div>
                        <div>{convertWindSpeed()} km/h</div>
                    </div>
                </div>

        const locationIcon = (props.loc === true) ? <MdLocationOn />: <span></span>;
        const deleteIcon = (props.loc === true) ? <span></span> :
                <div className="delete" onClick={() => props.deletePageEvent(props.id)}><TiDelete /></div> ;

        return (
            <div className="tile"> 
                <div className="title">
        <div className="lab"><b>{props.cityName} {weather.sys.country}</b> {locationIcon} </div>
                    {deleteIcon}
                </div>
                <div className="title">
                <div className="lab" > {convertTimestamp(weather.dt)} </div>
                </div>
                {weatherstate}
                {params}
                {wind}
                {sunset}
                {sunrise}
            </div>
        );
}

CityWeather.propTypes = {
    city: PropTypes.string,
    deleteEventPage: PropTypes.func,
    loc: PropTypes.bool
};

export default CityWeather;