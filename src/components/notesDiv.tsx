import react from 'react';
import {worstDeskHoursIndex } from '../generateCalendar';

export default function() {
	return <div className='NotesDiv'>
        <h3>Notes</h3>
        <div>The worst shifts are number {worstDeskHoursIndex.reduce(function(str:string, index:number){
            return `${str}, ${index+1}`
        }, "").substring(1)}</div>
        <div>
          Since they corresponds to: {worstDeskHoursIndex.map(function(index:number){
            return <div> {mapNumShiftToHours(index)} </div>
          })}
        </div>
    </div>  
}

function mapNumShiftToHours(index:number) {
  const start = 8 + (index * 2);
  const end = start + 2
  return `${start}:00 - ${end}:00`
}
