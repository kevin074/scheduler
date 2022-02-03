import react from "react";
import {IPerson} from '../constants';
import DeskHourStat from './deskHourStat'

//cafeDate accidentally used as desk hour dates;
export default function (props:{person:IPerson}) {
	const person = props.person;
	return (<div className="personStat">
		<div> {person.name} has {person.cafeteriaDutyDates.length} days of desk duties with score of {person.score}
        <DeskHourStat cafeDates={person.cafeteriaDutyDates}/>
      </div>
	</div>)
}