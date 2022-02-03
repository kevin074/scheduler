import moment from 'moment';
import { DateColumn, Person, IPerson, IDateColumn, DatePerson, IDatePerson, deskHours, deskHoursMap } from './constants';

export const DAY_OFF = 'day_off';
export const GRAD_DAY = 'graduationDay';
const HONOR_OFF = 'honor_off'; //HONOR OFF not implemented;
export const SUB_OFF = 'sub_off';
const FULL_DAY = 'full_day';
export const DESK_DUTY = 'desk_duty'
export const NONE_DAY = 'none_day'

const currentYearMonth = moment().format('YYYY-MM');
const is31DaysMonth = moment(currentYearMonth, 'YYYY-MM').daysInMonth() === 31 ;
const monthArray:IDateColumn[] = [];

function fillDaysOfWeek () {
	for (var i=1; i<=31; i++) {
		const day = i < 10 ? '0'+i : i
		const YYYYMMDD = `${currentYearMonth}-${day}`;
	
		monthArray.push(DateColumn(
			moment(YYYYMMDD),
			moment(`${YYYYMMDD}T08:00:00`).format('dddd'),
			i
		));
	}
}


const initialInputs = [
	{name:'kevin',  offDates:[4,5,6,10,11,20,21,27,28], graduationDate:undefined},
	{name:'ricky',  offDates:[3,4,5,10,11,19,20,24,27], graduationDate:undefined}, 
	{name:'nicole', offDates:[1,2,3,25,26,27,28,29,30], graduationDate:undefined},
	{name:'tina',   offDates:[14,15,20,21,26,27,28,29,30], graduationDate:undefined},
	{name:'rocky',  offDates:[2,3,9,10,16,17,23,24,30], graduationDate:undefined},
	{name:'chris',  offDates:[1,6,8,13,15,20,22,27,29], graduationDate:undefined},
	{name:'shelun', offDates:[3,4,5,10,11,12,24,25,26], graduationDate:undefined},
	{name:'rexy',   offDates:[6,7,13,14,19,20,25,26,30], graduationDate:undefined},
	{name:'papa',   offDates:[1,3,8,10,15,17,22,24,29], graduationDate:undefined},
	{name:'mama',   offDates:[3,6,10,15,19,23,26,29,30], graduationDate:undefined},
	{name:'frank',  offDates:[1,3,8,10,15,17,22,24,29], graduationDate:undefined},
	{name:'eileen', offDates:[1,7,8,14,15,16,21,22,28,29,30], graduationDate:undefined},
	{name:'roger',  offDates:[5,6,12,13,14,19,20,26,27], graduationDate:undefined},
	{name:'michael',offDates:[1,8,9,10,15,16,22,23,24], graduationDate:undefined},
	{name:'hyojung',offDates:[2,3,9,10,16,17,23,24,30], graduationDate:undefined},
	{name:'arin',   offDates:[1,2,8,9,16,17,18,24,25], graduationDate:27},
	{name:'binnie', offDates:[4,5,6,12,13,14,19,20,26], graduationDate:27},
	{name:'mimi',   offDates:[1,2,7,8,14,15,21,22,23,24,25,26], graduationDate:27},
	{name:'jiho',   offDates:[1,2,3], graduationDate:8},
	{name:'seung',  offDates:[1], graduationDate:5},
	{name:'yooa',   offDates:[2,3], graduationDate:4},
	{name:'will',   offDates:[1], graduationDate:2}
];

// const indexPrefix = 37;

// const persons = initialInputs.map(function(person:{ name:string, offDates:number[], graduationDate:number|undefined}, index:number){ 
	
// 	return Person(
// 		person.name, 
// 		indexPrefix + index, 
// 		person.offDates,
// 		person.graduationDate
// 	);
// });


function fillEachDayWithPerson (persons:IPerson[]) {
	fillDaysOfWeek();

	monthArray.forEach(function(day:IDateColumn){
		persons.forEach(function(person:IPerson){

			let event = 
				person.offDates.indexOf(day.dayOfMonth) > -1 ? 
					DAY_OFF : 
					person.graduationDate === day.dayOfMonth ? GRAD_DAY : FULL_DAY;

			if (day.dayOfMonth === 31 && !is31DaysMonth) {
				event = NONE_DAY;
			};

			if (day.dayOfMonth > (person.graduationDate || 31)) {
				event = NONE_DAY;
			};

			const nextDayEvent =
				person.offDates.indexOf(day.dayOfMonth +1) > -1 ? 
						DAY_OFF : 
						person.graduationDate === day.dayOfMonth+1 ? GRAD_DAY : FULL_DAY;


			day.datePersons.push( 
				DatePerson(
					day.dayOfMonth, 
					person,
					event,
					nextDayEvent
				) 
			);
		});
	});
};

export const worstDeskHoursIndex = [2, 6];
const worstHourAfter6 = deskHours[6];
const normHourAfter6 = deskHours[5];

let lastPersonIndex = 0;

export const fillNumberForDaytes = function (persons:IPerson[]) : { monthArray:IDateColumn[], persons:IPerson[] } { 
	fillEachDayWithPerson(persons);

	const half = Math.ceil(monthArray.length / 2);    

	const firstHalf = monthArray.slice(0, half)
	const secondHalf = monthArray.slice(half, monthArray.length)

	secondHalf.reverse();
	const modifiedMonthArray = firstHalf.concat(secondHalf)

	modifiedMonthArray.forEach(function(day:IDateColumn){
		const copiedDayPersons = ([] as IDatePerson[]).concat(day.datePersons);
		const copiedWorstHours = worstDeskHoursIndex.map(function(index){
			return deskHours[index];
		});
		const copiedDeskHours  = ([] as string[]).concat(
			deskHours.filter(function(hour:string){ return copiedWorstHours.indexOf(hour) === -1})
		);

		copiedDayPersons.forEach(function(datePerson:IDatePerson){

			if (datePerson.event === NONE_DAY) {
				datePerson.available = false;
			}

			if (datePerson.person.graduationDate && day.dayOfMonth >= datePerson.person.graduationDate) {
				datePerson.available = false; //we do not consider people who graduated already.
			}
			
			if (
				(datePerson.event === SUB_OFF || datePerson.event === DAY_OFF)
				// && (datePerson.nextDayEvent === SUB_OFF || datePerson.nextDayEvent === DAY_OFF)
			) {  
				datePerson.available = false //these are ppl having full day off.
			}; 

			if (datePerson.event  === FULL_DAY) {
				if(datePerson.nextDayEvent === SUB_OFF || datePerson.nextDayEvent === DAY_OFF) {
					datePerson.availableAfter6 = false; 
					//these are people leaving for vacation.
				}
				// else if (datePerson.nextDayEvent === FULL_DAY){
					//fully available people.
				// };
			} 

			else if (datePerson.nextDayEvent === FULL_DAY) {
				datePerson.availableBefore6 = false;
				datePerson.available = false;
				//there are people coming back from vacation
				//not sure if we want to include these people for duty yet ...
			};


		});		
		
		//when one person is fitted, he gets -5 score for each normal hour, -10 for each worst hour;
		//The most a person can get is -20; 
		//A person does not get more hours at 15 or above.
		//the person is also removed from consideration of the day's desk hour.

		findPeopleForWorstHours(copiedWorstHours, copiedDayPersons, day);
		findPeopleForNormHours(copiedDeskHours, copiedDayPersons, day);

		copiedDayPersons.forEach(function(datePerson:IDatePerson){
			//if the person has one day without any duty he automatically gains 10 points;
			//this way he won't be 15 and then one day off get another day ???????
			if(datePerson.event !== DESK_DUTY && datePerson.event !== NONE_DAY) { 
				datePerson.person.score += 5;				
			}

			//the most positive a person can have is 0 score;
			//otherwise he might have more than 2 days desk duty in a row;
			if(datePerson.person.score > 0) { datePerson.person.score = 0 }
		})
	})
	// people get off at 6 if their today is FULL_DAY and their nextDayEvent is SUB_OFF or DAY_OFF;
	// people get back at 6 if their today is an off day and their nextDayEvent is a full day;
	
	return { monthArray, persons }
};

// function getCorrectedIndex (increment:number) {
// 	let currentIndex = lastPersonIndex + increment;
// 	if (currentIndex >= persons.length) { currentIndex = currentIndex - persons.length};

// 	return currentIndex;
// }

function shuffleArray(array:any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function findPeopleForWorstHours (copiedWorstHours:string[], availablePeople:IDatePerson[], day:IDateColumn) {
	//go through the worstHours first
	//fit an available person with 0 score to the worstHours
	//if still have worstHours, fit an available person with -5 score to the worstHours
	//if still have worstHours, randomly assign someone since everyone has more negative or equal to -10
	//if still have worstHours, meaning everyone is already. at -20 or more, console out error for further consideration/debugging

	function getWeightedScore (currentDatePerson:IDatePerson) {
		return currentDatePerson.person.score -
			currentDatePerson.person.numWorst * 2.5 
	}

	function loopThroughAvailable (targetScore:number) {
		if (!copiedWorstHours.length) { return -1};

		const sortedPeople = availablePeople.sort(function(a:IDatePerson, b:IDatePerson){
			return getWeightedScore(a) > getWeightedScore(b) ? -1 : 1;
		});

		const clusters = sortedPeople.reduce(function(acc:{[key:string]:IDatePerson[]}, curr:IDatePerson){
			const hasKey = !!acc[curr.person.score];
			if(hasKey) { 
				acc[curr.person.score].push(curr);
			}

			else {
				acc[curr.person.score] = [curr];
			}

			return acc
		}, {})

		let sortedRandomPeople:IDatePerson[] = [];
		Object.keys(clusters).reverse().forEach(function(key:string){ //reverse for highest number first
			sortedRandomPeople = sortedRandomPeople.concat(shuffleArray(clusters[key]));
		});
		
		let index = -1;
		// for (let i = 0; i<availablePeople.length; i++) {
		for (let i = 0; i<sortedRandomPeople.length; i++) {
			if(!copiedWorstHours.length) { return index };

			// index = getCorrectedIndex(i);
			index = i;
			const currentHour = copiedWorstHours[0];
			const currentDatePerson = sortedRandomPeople[index];
			const hourCode = deskHoursMap[currentHour];

			if(currentHour === worstHourAfter6 && !currentDatePerson.availableAfter6) { 
				continue;
			}

			if (!currentDatePerson.available) { continue } 

			if (
					getWeightedScore(currentDatePerson) 
					- currentDatePerson.person.hourCodeCount[hourCode] * 2.5 
					>= targetScore 
				) {

				currentDatePerson.person.score += -10;

				currentDatePerson.hourCode = hourCode;
				currentDatePerson.person.hourCodeCount[hourCode]++;

				currentDatePerson.person.cafeteriaDutyDates.push(
					`${day.date.format('L')} ::: ${currentHour}`
				);

				currentDatePerson.event = DESK_DUTY; 
				currentDatePerson.hours = currentHour;
				currentDatePerson.available = false;
				currentDatePerson.person.numWorst++;
				copiedWorstHours.shift();
			}
		} 

		return copiedWorstHours.length ? -1 : index;

	}

	// availablePeople.sort(function(a:IDatePerson,b:IDatePerson){
	// 	return a.person.score > b.person.score ? -1 : 1
	// });
	
	const lastIndexA = loopThroughAvailable(0);
	const lastIndexB = loopThroughAvailable(-5);
	const lastIndexC = loopThroughAvailable(-10);
	const lastIndexD = loopThroughAvailable(-15);
	const lastIndexE = loopThroughAvailable(-20);

	lastPersonIndex = [lastIndexA, lastIndexB, lastIndexC, lastIndexD, lastIndexE]
							.filter(function(num:number){ return num > -1})[0] || 0;

	if(copiedWorstHours.length) { 
		day.dayIncomplete = true;
		console.error('cannot find people for worst hour') 
	}
}


function findPeopleForNormHours (copiedDeskHours:string[], availablePeople:IDatePerson[], day:IDateColumn) {
	//fit an available person to the rest desk hours
	//if no one can fit, then fit the first one
	//
	//if no one can fit then assign first person in array

	function loopThroughAvailable (targetScore:number) {
		if (!copiedDeskHours.length) { return -1 };

		const sortedPeople = availablePeople.sort(function(a:IDatePerson, b:IDatePerson){
			return a.person.score > b.person.score ? -1 : 1;
		});

		let index = -1;
		// for (var i = 0; i<availablePeople.length; i++){
		for (var i = 0; i<sortedPeople.length; i++){
			if(!copiedDeskHours.length) { return index };

			// index = getCorrectedIndex(i);
			index = i;
			const currentHour = copiedDeskHours[0];
			const currentDatePerson = availablePeople[index];
			const hourCode = deskHoursMap[currentHour];
			
			if (!currentDatePerson.available) { continue }

			if(currentHour === normHourAfter6 && !currentDatePerson.availableAfter6) { 
				continue;
			}

			if (!currentDatePerson.available) { continue } 

			if (getWeightScore(currentDatePerson, hourCode) >= targetScore) {
				currentDatePerson.person.score += -5;

				currentDatePerson.hourCode = hourCode;
				currentDatePerson.person.hourCodeCount[hourCode]++;

				currentDatePerson.person.cafeteriaDutyDates.push(
					`${day.date.format('L')} ::: ${currentHour}`
				);
				currentDatePerson.event = DESK_DUTY; 
				currentDatePerson.hours = currentHour;
				currentDatePerson.available = false;

				copiedDeskHours.shift();
			}
		}

		function getWeightScore (currentDatePerson:IDatePerson, hourCode:number) {
			return currentDatePerson.person.score 
				- currentDatePerson.person.hourCodeCount[hourCode] * 5
		}

		return copiedDeskHours.length ? -1 : index;
	}

	// availablePeople.sort(function(a:IDatePerson,b:IDatePerson){
	// 	return a.person.score > b.person.score ? -1 : 1
	// });

	const lastIndexA = loopThroughAvailable(0);
	const lastIndexB = loopThroughAvailable(-5);
	const lastIndexC = loopThroughAvailable(-10);
	const lastIndexD = loopThroughAvailable(-15);
	const lastIndexE = loopThroughAvailable(-20);
	
	lastPersonIndex = [lastIndexA, lastIndexB, lastIndexC, lastIndexD, lastIndexE]
							.filter(function(num:number){ return num > -1})[0] || 0;

	if (copiedDeskHours.length) { 
		day.dayIncomplete = true;
		console.log('cannot find people for normal hours')
	}
}




