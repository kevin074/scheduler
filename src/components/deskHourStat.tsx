import react from "react";

export default function (props:{cafeDates:string[]}):JSX.Element {
  const hourCount:{[key:string]: number} = {};

  function decodeDateHour (dateHour:string) {
    const splitted = dateHour.split(':::');
    return {
      date: splitted[0].trim(),
      hour: splitted[1].trim()
    }
  }

  const retrunDiv = props.cafeDates.map(function(dateHour:string, index:number){
    const dateHourObj = decodeDateHour(dateHour);
    hourCount[dateHourObj.hour] = hourCount[dateHourObj.hour] ? hourCount[dateHourObj.hour]+1 : 1;

    return <div key={index}> {dateHourObj.date} : {dateHourObj.hour} </div>;
  });
  
  const stat = Object.keys(hourCount).sort(function(a:string,b:string){
  	return parseInt(a) > parseInt(b) ? 1 : -1;
  }).map(function(key:string){
    return <div> {key} : {hourCount[key]} </div>
  })

  return <div>{retrunDiv.concat(stat)}</div>;
}

