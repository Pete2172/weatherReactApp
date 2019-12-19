import React, {useState} from 'react';
import './SearchBar.css'


function SearchBar(props){  // props.addCity 

    const [city, setCity] = useState("");

    function add(){
        if(city !== ""){
            props.addCity(city); 
            setCity("");
        }
    }
 
    return (
        <div className="bar">
            <input 
                type="text" 
                value={city} 
                placeholder="Type city's name..." 
                onChange={e => {setCity(e.target.value)}}
                onKeyPress={ e => {
                        if(e.key === 'Enter'){
                            add();
                        } 
                    }
                }
            />
            <input 
                type="button" 
                onClick={() => {add()} } 
                value="Add" 
            />
        </div>
    );
}

export default SearchBar;