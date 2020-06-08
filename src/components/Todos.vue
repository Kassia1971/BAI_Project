<template>
  <div class="container">
    <div class="content">
      <div class="form m-2">
        <form @submit="addTodo($event)">
          <h2 class="text-center">To-Do List</h2>
          <div class="form-group inputsWrapper">
            <b-form-input v-model="newNote" class="addNoteInput" placeholder="Add new note"></b-form-input>
            <b-button :variant="isFormValid ? 'success' : 'warning'" type="submit" class="addNoteBtn" :disabled="!isFormValid">Add New Todo</b-button>
          </div>
          <b-form-group class="note-label" label="Note type">
            <b-form-radio-group id="radio-group-2" class="note-group" v-model="noteType" name="radio-sub-component">
              <b-form-radio checked value="simple">Simple note</b-form-radio>
              <b-form-radio value="list">List note</b-form-radio>
              <b-form-radio value="duration">Duration note</b-form-radio>
              <b-form-radio value="end-time">End time note</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <div v-if="noteType === 'list'" class="options-panel">
            <div>
              <p>Add item to the list</p>
              <div class="listElementWrapper">
                <div class="listElementsWrapper" v-if="listElements.length > 0" >
                  <div v-for="(element, index) in listElements" :key='index' class="listElement">
                    <p><span>{{index+1}}.</span> <b>{{element.value}}</b></p>
                    <b-button @click="removeListElement(element)" variant="danger"> <BIconX/></b-button>
                  </div>
                </div>
                <div class="inputListElementWrapper">
                   <b-form-input v-model="newListElement" placeholder="Add new list element" type="text"></b-form-input>
                    <b-button @click="addListElement()" variant="success"> <BIconPlus/></b-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="noteType === 'duration'" class="options-panel">
            <div>
              <p>Enter the duration of the task</p>
              <div class="durationField">
                <div>
                  <label for="durationTime">Time:</label>
                  <b-form-input type="time" :state="isDurationTimeValid" v-model="durationTime" id="durationTime"></b-form-input>
                   <b-form-invalid-feedback id="durationSecond-feedback">
                    Please enter a valid time
                  </b-form-invalid-feedback>
                </div>
                <div>
                  <label for="durationSecond">Seconds:</label>
                  <b-form-input type="number" :state="isSecondsValid" v-model="durationSeconds" id="durationSecond" max='60'></b-form-input>
                  <b-form-invalid-feedback id="durationSecond-feedback">
                    Please enter a valid number of seconds
                  </b-form-invalid-feedback>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="noteType === 'end-time'" class="options-panel">
            <div class="calendarWrapper">
              <div>
                <p>Enter date to complete the task</p>
                <b-calendar :min="calendarMinDate" v-model="calendar"></b-calendar>
                <b-form-invalid-feedback id="calendar-feedback">
                    Please enter a valid date
                  </b-form-invalid-feedback>
              </div>
              <div>
                <p>Enter time to complete the task</p>
                <b-form-input :state="isEndTimeValid" v-model="endTime" type="time"></b-form-input>
                 <b-form-invalid-feedback id="calendarTime-feedback">
                    Please enter a valid time
                  </b-form-invalid-feedback>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="todoWrapper">
        <h4 class="text-center">Tasks To-Do:</h4>
        <article v-for="(todo, index) in todos" :key="index">
          <EndTimeNote v-if="todo.type === 'end-time'" :todo="todo" :index="index" :deleteNote="deleteNote" :switchToEditMode="switchToEditMode" :revertNote="revertNote" :endNote="endNote" :abandonChanges="abandonChanges" :updateNote="updateNote" :inEditModeObject="inEditModeObject"/>
          <DurationNote v-else-if="todo.type === 'duration'" :todo="todo" :index="index" :deleteNote="deleteNote" :switchToEditMode="switchToEditMode" :revertNote="revertNote" :endNote="endNote" :abandonChanges="abandonChanges" :updateNote="updateNote" :inEditModeObject="inEditModeObject" />
          <ListNote v-else-if="todo.type === 'list'" :todo="todo" :index="index" :deleteNote="deleteNote" :switchToEditMode="switchToEditMode" :revertNote="revertNote" :endNote="endNote" :abandonChanges="abandonChanges" :updateNote="updateNoteInList" :inEditModeObject="inEditModeObject" />
          <SimpleNote v-else :todo="todo" :index="index" :deleteNote="deleteNote" :switchToEditMode="switchToEditMode" :revertNote="revertNote" :endNote="endNote" :abandonChanges="abandonChanges" :updateNote="updateNote" :inEditModeObject="inEditModeObject" />
        </article>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    db
  } from "../main";
  import {
    BIconTrash,
    BIconPencil,
    BIconCheck,
    BIconReply,
    BIconX,
    BIconFileCheck,
    BIconPlus,
    BIconPlayFill,
    BIconStopFill
  } from "bootstrap-vue";

  import SimpleNote from "./note-types/SimpleNote";
  import DurationNote from "./note-types/DurationNote";
  import ListNote from "./note-types/ListNote";
  import EndTimeNote from "./note-types/EndTimeNote";

  export default {
    name: "Todo",

    data() {
      return {
        todos: [],
        inEditModeObject: {},
        newNote: "",
        userId: this.$store.getters.userId,
        // Note
        noteType: "simple", // type
        newListElement: '', // list
        listElements: [], // list
        calendar: new Date(), // end-time
        endTime: '', // end-time
        durationTime: '', // duration
        durationSeconds: '' // duration
      };
    },

    firestore() {
      return {
        todos: db.collection(this.userId).orderBy("createdAt", "desc")
      };
    },

    computed: {
      isFormValid: function(){
        const isNoteEmpty = this.newNote === '';
        switch(this.noteType){
          case 'end-time':
            return this.isEndTimeValid && !isNoteEmpty
          case 'duration':
            return this.isSecondsValid && this.isDurationTimeValid && !isNoteEmpty
          default:
           return !isNoteEmpty
        }
      },
      endTimeDate: function(){
        const endTimeArray = this.endTime.split(':')
        const hoursToSec = parseInt(endTimeArray[0],10) * 60 * 60;
        const minToSec = parseInt(endTimeArray[1],10)  * 60;
        const sec = hoursToSec + minToSec;
        const calendar = new Date(this.calendar)
        const calendarDate = new Date(calendar.getFullYear(), calendar.getMonth(), calendar.getDate())
        const date = new Date((calendarDate).valueOf() + sec * 1000)
        return date;
      },
      duration: function (){
        const durationTimeArray = this.durationTime.split(':')
        const hoursToSec = parseInt(durationTimeArray[0],10) * 60 * 60;
        const minToSec = parseInt(durationTimeArray[1],10)  * 60;
        const sec = parseInt(this.durationSeconds, 10)
        return hoursToSec + minToSec + sec;
      },
      isSecondsValid: function () {
        return parseInt(this.durationSeconds, 10) < 60
      },
      isDurationTimeValid: function () {
        return this.durationTime !== ''
      },
      isEndTimeValid: function () {
        if(this.calendarMinDate.toLocaleDateString() === new Date(this.calendar).toLocaleDateString()){
          const endTimeArray = this.endTime.split(':');
          const now = new Date()
          const timeNow = now.getMinutes() + now.getHours() * 60;
          const selectedTime = parseInt(endTimeArray[0],10) * 60 + parseInt(endTimeArray[1],10);
          return timeNow  <  selectedTime
        }
        return this.endTime !== ''
      },
      isCalendarTimeValid: function () {
        return this.calendar !== ''
      },
      calendarMinDate: function(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today)
        return minDate;
      }
    },

    watch: {
      noteType: function () {
        if(this.noteType !== 'list'){
          this.listElements = []
          this.newListElement = ''
        }

        if(this.noteType !== 'end-time'){
          this.calendar = new Date()
          this.endTime = ''
        }

        if(this.noteType !== 'duration'){
          this.durationTime =  ''
          this.durationSeconds = ''
        }
      }
    },

    methods: {
      sortTodos() {
        return this.todos.sort((first, next) => {
          return first.isActive ? -1 : 1;
        });
      },

      addListElement(){
        if(this.newListElement === ''){
          return
        }

        this.listElements.push({value: this.newListElement})
        this.newListElement = '';
      },

      removeListElement({value}){
        this.listElements = this.listElements.filter(element => element.value !== value)
      },

      addTodo($event) {

        $event.preventDefault();

        const isListElementEmpty = this.listElements.length === 0;

        if(this.newNote === ''){
          return
        }

        let dataObject = {}
        switch(this.noteType){
          case 'end-time':
          if(!this.isEndTimeValid){
            return
          }

          dataObject = {
            note: this.newNote,
            createdAt: new Date(),
            isActive: true,
            type: this.noteType,
            endTime: this.endTimeDate
          }
          break;
          case 'duration':
          if(!this.isSecondsValid || !this.isDurationTimeValid){
            return
          }
          dataObject = {
            note: this.newNote,
            createdAt: new Date(),
            isActive: true,
            type: this.noteType,
            duration: this.duration,
            remainingDuration: this.duration
          }
          break;
          case 'list':
          dataObject = {
            note: this.newNote,
            createdAt: new Date(),
            isActive: true,
            type: this.noteType,
            elements: this.listElements
          }
          if(!isListElementEmpty){
            break;
          }
          default:
          dataObject = {
            note: this.newNote,
            createdAt: new Date(),
            isActive: true,
            type: 'simple'
          }
        }

        db.collection(this.userId)
          .add(dataObject)
          .then(res => {
            this.newNote = "";
            this.noteType = 'simple'
          })
          .catch(err => {
            alert(err.message);
          });
      },

      updateNote(id, newNote) {
        delete this.inEditModeObject[id];

        db.collection(this.userId)
          .doc(id)
          .update({
            modifiedAt: new Date(),
            note: newNote
          });
      },

      updateNoteInList(id, newNote) {
        delete this.inEditModeObject[id];

        db.collection(this.userId)
          .doc(id)
          .update({
            modifiedAt: new Date(),
            note: newNote.changedNote,
            elements: newNote.elements
          });
      },

      deleteNote(id) {
        db.collection(this.userId)
          .doc(id)
          .delete();
      },

      abandonChanges(id) {
        delete this.inEditModeObject[id];
        this.inEditModeObject = { ...this.inEditModeObject};
      },

      switchToEditMode(index) {
        this.inEditModeObject = {
          ...this.inEditModeObject,
          [this.todos[index].id]: {
            changedNote: this.todos[index].note,
            inEditMode: true,
            elements: this.todos[index].type === 'list' ? this.todos[index].elements : undefined
          }
        };
      },

      endNote(id) {
        db.collection(this.userId)
          .doc(id)
          .update({
            isActive: false,
            endAt: new Date()
          });
      },

      revertNote(id) {
        db.collection(this.userId)
          .doc(id)
          .update({
            isActive: true,
            endAt: null
          });
      }
    },
    components: {
      BIconTrash,
      BIconPencil,
      BIconCheck,
      BIconReply,
      BIconX,
      BIconPlus,
      BIconFileCheck,
      SimpleNote,
      DurationNote,
      ListNote,
      EndTimeNote,
      BIconPlayFill,
      BIconStopFill
    }
  };
</script>

<style>
  .logout {
    width: auto;
  }

  .options-panel {
    margin: 0.5rem 0;
  }

  .header {
    padding: 1rem;
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
    align-items: center;
  }

  .todoWrapper {
    margin: 2rem 0;
    padding: 0.5rem;
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .todoElement {
    margin: 1rem 0;
  }

  .content {
    display: flex;
    flex-flow: column;
    justify-content: center;
  }

  .form-group>* {
    display: block;
  }

  .editInputWrapper {
    width: 100%;
  }

  .inputsWrapper,
  .note-group,
  .addNoteInput,
  .inputListElementWrapper,
  .elementRow,
  .listElement,
  .editInputWrapper,
  .durationField {
    margin: 0 auto;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }

  .inputListElementWrapper > input {
    margin-right: 2rem;
  }


  .addNoteInput {
    width: 100%;
    margin-right: 2rem;
  }

  .elementInnerRow {
    width: 100%;
    margin-right: 2rem;
    margin-left: 1rem;
  }

  .addNoteBtn,
  .elementInnerRow button {
    width: 200px;
  }

  .inactiveEntry {
    text-decoration: line-through;
    font-weight: lighter;
  }

  .timeWrapper {
    font-size: 0.7rem;
  }

  .timeWrapper>span {
    margin-right: 0.5rem;
  }

  .editNoteButtonsGroup {
    margin-left: 1rem;
    max-width: 100px;
  }

  .calendarWrapper {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: top;
  }

  .note-group {
    text-align: left;
  }

  .note-label{
    margin-top: 0.5rem;
  }

  .durationField > * {
    max-width: 50%;
    min-width: 30%;
  }


</style>
