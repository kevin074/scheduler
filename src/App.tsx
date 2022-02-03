import React, { useState } from 'react';
import './index.scss';
import { fillNumberForDaytes, DAY_OFF, GRAD_DAY, DESK_DUTY, SUB_OFF, NONE_DAY } from './generateCalendar';
import XLSX from 'xlsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faGraduationCap, faTimes, faUserTie } from '@fortawesome/free-solid-svg-icons';
import {Person, IPerson, IDateColumn} from './constants';
import StatView from './components/statView';
import Modal from './components/modal'
import PersonStat from './components/personStat';
import SelectDay from './components/selectDay';
import NotesDiv from './components/notesDiv';

const days = new Array(32).fill(1); // 31 days plus name

  function onDragOver (e:any) {
    let event = e as Event;
    event.stopPropagation();
    event.preventDefault();
  }

  function onDragEnter (e:any) {
    const event = e as Event;
    event.stopPropagation();
  }


function getInfoFromDates (sheet:XLSX.WorkSheet, personRowIndexes:number[], columns:string[]):IPerson[] {
    const offDaysSymbol = ['Ｏ','病','喪','補','優'];
    const offDates  = [] as number[][];
    const dutyDates = [] as number[][];
    const DAY_NUM_ROW_INDEX = 3;
    const persons = [] as IPerson[];

    personRowIndexes.forEach(function(rowNum:number){
      const person = {
        id:sheet[`A${rowNum}`].v, 
        name:sheet[`B${rowNum}`].v, 
        offDates:[] as number[], 
        dutyDates:[] as number[],
        graduationDate:undefined
      };

      columns.forEach(function(colLetters:string){
        const key = colLetters + rowNum;
        const value = sheet[key] && sheet[key].v;
        const day = sheet[colLetters + DAY_NUM_ROW_INDEX] && sheet[colLetters + DAY_NUM_ROW_INDEX].v;

        if(!value || !day || !parseInt(day)) return;

        if(value === '退') {
          person.graduationDate = day
        }

        else if(offDaysSymbol.indexOf(value) > -1){
          person.offDates.push(day) 
        } 
        else if(!isNaN(parseInt(value))) {
          person.dutyDates.push(day);
        }
      });

      persons.push(Person(person.name, person.id, person.offDates, person.graduationDate, person.dutyDates))

    })  

    return persons
}


function getPersonRowIndexes (sheet:XLSX.WorkSheet):number[] {
  const FIRST_NUMBER_KEY = 'A5';
  const FIRST_NUMBER_INDEX = 5

  let currentIndex = FIRST_NUMBER_KEY
  let i = FIRST_NUMBER_INDEX;
  const indexArray = []

  while (typeof sheet[currentIndex].v === 'number') {
    indexArray.push(i++);
    currentIndex = 'A' + i;
  };

  return indexArray
}

function App() { 
  const [numPersons, setNumPersons] = useState([] as number[]);
  const [monthArray, setMonthArray] = useState([] as IDateColumn[]);
  const [persons, setPersons] = useState([] as IPerson[]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statPerson, setStatePerson] = useState<IPerson | null>(null)
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  function viewStats (e:any) {
      const personName = e.target.innerText
      let currentPerson = persons.filter(function(person:IPerson){
          return person.name === personName
      })[0];

      setModalContent(<PersonStat person={currentPerson}/>);
      setIsModalVisible(true);
  }

  function onFileDrop(e:any) {
    
    e.stopPropagation(); e.preventDefault();
    const files = e.dataTransfer && e.dataTransfer.files;
    
    if(!files || !files.length) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e:any) {
      
      const data = new Uint8Array(e.target && e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0]; 
      const sheet = workbook.Sheets[sheetName];
      const personRowIndexes = getPersonRowIndexes(sheet);
      
      const columns = Object.keys(sheet).reduce(function(map:{[key:string]:true}, key:string){
        map[key.replace(/[0-9]/g, '')] = true;
        return map;
      }, {})
      
      delete columns['!margins'];
      delete columns['!merges'];
      delete columns['!ref'];
      
      const prePersons = getInfoFromDates(sheet, personRowIndexes, Object.keys(columns));
      const {monthArray, persons:postPersons} = fillNumberForDaytes(prePersons); 
      
      setMonthArray(monthArray);
      setPersons(postPersons);      
      setNumPersons(new Array(postPersons.length + 1).fill(1)); //+1 for the row that displays day of the month  
    };
    
    reader.readAsArrayBuffer(files[0]);
    
  };


  return ( 
    <div className="App"> 

      <div
          style={{width:'200px', height:'200px', background:'green'}}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDrop={onFileDrop}>

          Drag and drop file here
      </div>

      <Modal  visibility={isModalVisible} 
              content={modalContent}
              hideModal={setIsModalVisible.bind(null, false)}
      />


      <div className={numPersons.length ? "chartDisplay" : "chartDisplay hidden"} >

      { numPersons.map(function(_:any, row:number) {
        return <div className='rowDiv' key={'row' + row }>
           {
             days.map(function(_:any, col:number) {
               if (row === 0 && col > 0) {
                 if (monthArray[col-1].dayIncomplete) {
                   return <div className='colDiv warning' key={'row'+row+'col'+col}>{col}</div>  
                 }
                 return <div className='colDiv' key={'row'+row+'col'+col}>{col}</div>
               }
               else if (row > 0 && col === 0) {

                 const nameClass = 'colDiv name' 
                   + (persons[row-1].numWorst <=2 ? ' blueWarning' : '') 
                   + (persons[row-1].numWorst >=4 ? ' warning' : '') 
                  return <div className={nameClass} key={'row'+row+'col'+col} onClick={viewStats}>
                       {persons[row-1].name}
                    </div>
               }

               if (row>0 && col>0) {
                 
                  const event = monthArray[col-1].datePersons[row-1].event;
                  const indexKey = 'row'+row+'col'+col;
                  const hourCode = monthArray[col-1].datePersons[row-1].hourCode;

                  return <SelectDay event={event} indexKey={indexKey} hourCode={hourCode} />
               };

               return <div className='colDiv' key='row0col0'></div> //for [0,0] position cell;
             })
           }
        </div>
      })
    }
    
    <NotesDiv />
    <StatView filledPersons={persons}/>


    </div>

    </div>
  );
}

export default App; 