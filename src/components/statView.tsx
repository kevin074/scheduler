import React from 'react';
import {IPerson} from '../constants';
import DeskHourStat from './deskHourStat'

function StatView(props: {filledPersons:IPerson[]}):JSX.Element { 
  const filledPersons = props.filledPersons;
  return ( 
    <div className="statView">
      { filledPersons.map(function(person:IPerson){
        return <div> {person.name} has {person.cafeteriaDutyDates.length} days of desk duties with score of {person.score}
            <DeskHourStat cafeDates={person.cafeteriaDutyDates}/>
          </div>
      })}
    </div>
  );
}

export default StatView;