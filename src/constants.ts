import moment from 'moment';

export const deskHours = [
	'08:00-10:00',
	'10:00-12:00',
	'12:00-14:00',
	'14:00-16:00',
	'16:00-18:00',
	'18:00-20:00',
	'20:00-22:00'
];

export const deskHoursMap = deskHours.reduce(function(acc:{[key:string]:number}, current:string, index:number){
	acc[current] = index+1;
	return acc;
}, {})


export interface IPerson {
	name:string,
	personID:number,
	offDates:number[],
	trashDates:number[],
	cafeteriaDutyDates:string[],
	deskDateHours:number[],
	score:number,
	isGoingHomeAt6:false,
	graduationDate: number | undefined;
	numWorst:number;
	trueScore:number;
	hourCodeCount:{[key:string]:number}
}

export const Person = function (name:string, personID:number, offDates:number[], graduationDate?:number, deskDateHours?:number[],): IPerson {
	return {
		name: name,
		personID: personID,

		offDates:offDates,
		trashDates:[],
		cafeteriaDutyDates:[],
		deskDateHours: deskDateHours ? deskDateHours : [], 
		//  {
		// 		date: number
		//      hours:STRING 08:00-10:00
		//  } 

		score:0,
		isGoingHomeAt6:false,
		graduationDate: graduationDate ? graduationDate : undefined,
		numWorst:0,
		trueScore:0,
		hourCodeCount:deskHours.reduce(function(acc:{[key:string]:number}, a:any, index:number){
			acc[index+1] = 0
			return acc;
		},{}),
	}
}

export interface IDatePerson {
	dayOfMonth:number,
	hours:string,
	hourCode:number,
	person:IPerson,
	event:string,
	nextDayEvent:string,
	availableAfter6:boolean,
	availableBefore6:boolean,
	honorOff:string|null,
	available:boolean,
	hadWorstHour:boolean,
}

export const DatePerson = function (dayOfMonth:number, person:IPerson, event:string, nextDayEvent:string): IDatePerson {
	return {
		dayOfMonth:dayOfMonth,  
		hours: '',
		hourCode: -1,
		person: person,
		event:event,
		nextDayEvent:nextDayEvent,
		available:true,
		availableAfter6:true,
		availableBefore6:true,
		honorOff:null,
		hadWorstHour:false,
	}
}

export interface IDateColumn {
	date:moment.Moment,
	dayOfWeek:string,
	datePersons: IDatePerson[],
	dayOfMonth: number,
	dayIncomplete:boolean,
}

export const DateColumn = function(date:moment.Moment, dayOfWeek:string, dayOfMonth:number): IDateColumn {
	return {
		date:date, 		//moment().format("MMM Do YY"); // May 23rd 21
		dayOfWeek: dayOfWeek, 	//Thursday
		datePersons:[], 	//DatePerson[]
		dayOfMonth:  dayOfMonth, 
		dayIncomplete: false,
	}
} 

