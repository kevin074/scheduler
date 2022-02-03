import react from "react";
import { DAY_OFF, GRAD_DAY, DESK_DUTY, SUB_OFF, NONE_DAY } from '../generateCalendar';
import { faBed, faGraduationCap, faTimes, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-dropdown-select';

const options = [
	{id:"1", name:"1"},
	{id:"2", name:"2"},
	{id:"3", name:"3"},
	{id:"4", name:"4"},
	{id:"5", name:"5"},
	{id:"6", name:"6"},
	{id:"7", name:"7"},
	{id:DAY_OFF, name:"輪"},
	{id:GRAD_DAY, name:"退"},
	{id:NONE_DAY, name:"X"}
];


export default function (props:{event:string, indexKey:string, hourCode:number}):JSX.Element {
	  const event = props.event;
	  const indexKey = props.indexKey;
	  const hourCode = props.hourCode;


		const selectValue = [{
 			id:event,
 			name:hourCode === -1 ? "" : hourCode+""
	   }]
	  // if (event === GRAD_DAY) {
	  //   return <div className='colDiv' key={indexKey}>
	  //       <FontAwesomeIcon icon={faGraduationCap} />
	  //   </div>
	  // }

	  // if (event === DAY_OFF || event === SUB_OFF) {
	  //   return <div className='colDiv' key={indexKey}>
	  //       <FontAwesomeIcon icon={faBed} />
	  //   </div>
	  // }

	  // if (event === DESK_DUTY) {
	  //   return <div className='colDiv' key={indexKey}>
	  //       <span className='hourText'>{hourCode}</span>
	  //       <FontAwesomeIcon icon={faUserTie} />
	  //   </div>
	  // }

	  // if (event === NONE_DAY) {
	  //   return <div className='colDiv' key={indexKey}>
	  //       <FontAwesomeIcon icon={faTimes} />
	  //   </div>
  	//   }

  	 return <Select 
  	 	key={indexKey}
  	    className='colDiv'
  	 	options={options}
  	 	values={selectValue}
  	 	clearOnBlur={true}
  	 	clearOnSelect={true}
  	 	clearable={false}
  	 	dropdownHandle={false}
  	 	labelField={"name"} 
  	 	valueField={"name"} 
  	 	placeholder=""
	 	onChange={(value) => console.log(value)}
	 	contentRenderer={customContentRenderer}
  	 />
}

 type ContentRenderer = {
 	state:{
 		values:{
 			id:any,
 			name:any
 		}[],
 	}
 }

 function customContentRenderer ({state}:ContentRenderer) {
 	const displayValue = state.values.length ? 
 		state.values[0].name : '';
 	const displayID = state.values.length ? 
 		state.values[0].id : '';

	if (displayID === DAY_OFF) {
		return <FontAwesomeIcon icon={faBed} />
	}  	
	if (displayID === GRAD_DAY) {
		return <FontAwesomeIcon icon={faGraduationCap} />
	}  	
	if (displayID === NONE_DAY) {
		return <FontAwesomeIcon icon={faTimes} />
	}  	

 	return displayValue.length ? 
	 	<div className="hoursDisplay">
	 		<span className='hourText'>{displayValue}</span>
        <FontAwesomeIcon icon={faUserTie} />
	 	</div> : 
	 	<div></div>
 }

