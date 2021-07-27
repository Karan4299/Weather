import React,{useState,useEffect} from 'react';
import MainContext from './providerContext';
import axios from 'axios';


const Provider = ({children}) =>{
    const [state,setState] = useState(""); 
    const [temp,setTemp] = useState("C");
    const [theme,setTheme] = useState("Light");
    // const [hour,setHour] = useState();
    let datas;
    let hours;
    let daily;
    let dailytemp;
    let dailyhigh;
    let dailylow;
    let allmaxwind=0;
    let allminwind = 0;
    let allmaxtemp=0;
    let allmintemp=0;
    let allmaxhumi=0;
    let allminhumi=0;
    let allmaxcloud=0;
    let allmincloud =0;
    let allmaxpress=0;
    let allminpress=0;
    let allmaxuvi=0;
    let allminuvi=0;

    let night=new Date().getHours();

    useEffect(()=>{
        axios.get("https://api.openweathermap.org/data/2.5/onecall?lat=12.97623&lon=77.603287&exclude=minutely&appid=bf0104f39cfe79918b4c9b253353ed1e")
        .then(data=>{
            // console.log(data.data.hourly)
            // hours = data.data.hourly.filter((item)=>(new Date((item.dt-19800)*1000)>=new Date()));
            return setState(data.data)
        });
    },[]);

    const changeTheme = (theme) =>{
        setTheme(theme);
    }
    const getTemp = (temprature) => {
        if(temp==="C"){
            return temprature-273.15;
        }else{
            return  ((temprature - 273.15) * (9/5) + 32);
        }
    }
    console.log(state)


    const changeTemp = (cur) => () => {
        // console.log(cur);
        if(cur!==temp){
            setTemp(cur);
        }
    }


    if(state){
        hours = state.hourly.filter((item,i)=>{
            // 
            if(new Date((item.dt-19800)*1000)>=new Date() 
            && new Date((item.dt-19800)*1000)<=new Date().setHours(new Date().getHours()+7)){
                return item
                // i++;
            }

        });

        datas = hours.map(item=>{
            return (""+new Date((item.dt-19800)*1000).getHours()+":00");
        })

        dailytemp = hours.map(item=>{
            return(getTemp(item.temp));
        })

        daily = state.daily.filter((item,i)=>{
            if(i!==0){
                return true;
            }
        }) 

        

        dailyhigh = daily.map((item,i)=>{
            allmaxwind = Math.max(parseInt(allmaxwind),parseInt(item.wind_speed))
            allmaxtemp = Math.max(parseInt(allmaxtemp),parseInt(item.temp.max))
            allmintemp = allmintemp===0?allmintemp=item.temp.min:Math.min(parseInt(allmintemp),parseInt(item.temp.min))
            allmaxhumi = Math.max(parseInt(allmaxhumi),parseInt(item.humidity))
            allmaxpress = Math.max(parseInt(allmaxpress),parseInt(item.pressure))
            allmaxcloud = Math.max(parseInt(allmaxcloud),parseInt(item.clouds))
            allmaxuvi = Math.max(parseInt(allmaxuvi),parseInt(item.uvi))

            allminwind = allminwind===0?allminwind=item.wind_speed:Math.min(parseInt(allminwind),parseInt(item.wind_speed))
            // allmintemp = allmintemp===0?allmintemp=item.wind_speed:Math.min(parseInt(allmintemp),parseInt(item.temp.max))
            allminhumi = allminhumi===0?allminhumi=item.humidity:Math.min(parseInt(allminhumi),parseInt(item.humidity))
            allminpress = allminpress===0?allminpress=item.pressure:Math.min(parseInt(allminpress),parseInt(item.pressure))
            allmincloud = allmincloud===0?allmincloud=item.clouds:Math.min(parseInt(allmincloud),parseInt(item.clouds))
            allminuvi = allminuvi===0?allminuvi=item.uvi:Math.min(parseInt(allminuvi),parseInt(item.uvi))
        //    console.log(Math.max(parseInt(allwind),parseInt(item.wind_speed))) 
            return getTemp(item.temp.max);
        })


        dailylow = daily.map((item,i)=>{
            return getTemp(item.temp.min);
        })
    }
    const icons = {
        "Clouds":{
            icon:theme==="Dark"?<i class="fad fa-cloud-moon" Style="--fa-primary-color: grey; --fa-secondary-color: rgb(233,232,228); --fa-secondary-opacity: 1.0"></i>:<i className="fad fa-cloud"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)'
        },
        "Clear":{
            icon:<i className="fad fa-sun"></i>,
            color:'rgba(255,206,100)',
        },
        "Drizzle":{
            icon:theme==="Dark"?<i class="fad fa-cloud-moon-rain"></i>:<i className="fad fa-cloud-drizzle fa-swap-opacity " Style="--fa-primary-color: rgb(233,232,238); --fa-secondary-color: rgb(62,76,199); --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)'
        },
        "Rain":{
            icon:theme==="Dark"?<i class="fas fa-cloud-moon-rain"></i>:<i className="fad fa-cloud-showers-heavy fa-swap-opacity" Style="--fa-primary-color: rgb(233,232,238); --fa-secondary-color: rgb(62,76,199); --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgb(62,76,199)'
        },
        "Thunderstorm":{
            icon:theme==="Dark"?<i class="fad fa-thunderstorm-moon"></i>:<i className="fad fa-thunderstorm fa-swap-opacity" Style="--fa-primary-color: rgb(233,232,238); --fa-secondary-color: orange; --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'yellow',
        },
        "Snow":{
            icon:<i className="fad fa-snowflakes"></i>,
            color:theme==="Dark"?'rgba(233,232,228)':'silver'
        },
        "Mist":{
            icon:<i className="fad fa-fog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)'
        },
        "Smoke":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Haze":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Fog":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Sand":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Ash":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Squall":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "Tornado":{
            icon:<i class="fad fa-smog" Style="--fa-primary-color: rgb(233,232,238);--fa-secondary-color: rgb(62,76,199);  --fa-secondary-opacity: 1.0"></i>,
            color:theme==="Dark"?'rgb(233,232,228)':'rgba(62,76,199)',
        },
        "":{
            icon:<i class="fas fa-ghost"></i>,
            color:'white'
        }
    }


    

    const geticon = (weather) =>{
        // console.log(weather)
        return icons[weather];
    }

    const getDay=(day)=>{
        const days = ["Sunday","Monday","Tuesday","Wednesday",'Thursday',"Friday","Saturday"];
        return days[day];
    }

    return(
        <MainContext.Provider 
        value={{theme,changeTheme,dailyhigh,dailylow,daily,state,icons,geticon,temp,hours,datas,getTemp,getDay,changeTemp,dailytemp,
            allmaxtemp,allmaxuvi,allmaxcloud,allmaxhumi,allmaxtemp,allmintemp,allmaxpress,allmaxwind,
            allmintemp,allminuvi,allmincloud,allminhumi,allminpress,allminwind}}>
            {children}
        </MainContext.Provider>
    )
}

export default Provider;
