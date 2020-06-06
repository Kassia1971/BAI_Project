<template>
  <div class="container">
    <div class="content">
      <div class="form m-2">
        <form @submit="addTodo()">
          <h2 class="text-center">To-Do List</h2>
          <div class="form-group inputsWrapper">
            <b-form-input v-model="newNote" class="addNoteInput" placeholder="Add new note"></b-form-input>
            <b-button variant="success" type="submit" class="addNoteBtn">Add New Todo</b-button>
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
              <b-form-input type="time"></b-form-input>
            </div>
          </div>
          <div v-else-if="noteType === 'end-time'" class="options-panel">
            <div class="calendarWrapper">
              <div>
                <p>Enter date to complete the task</p>
                <b-calendar v-model="calendar"></b-calendar>
              </div>
              <div>
                <p>Enter time to complete the task</p>
                <b-form-input type="time"></b-form-input>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="todoWrapper">
        <h4 class="text-center">Tasks To-Do:</h4>
        <article v-for="(todo, index) in todos" :key="index">
          <EndTimeNote v-if="todo.type === 'end-time'" />
          <DurationNote v-else-if="todo.type === 'duration'" />
          <ListNote v-else-if="todo.type === 'list'" />
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
    BIconPlus
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
        noteType: "simple",
        newListElement: '',
        calendar: '',
        listElements: []
      };
    },

    firestore() {
      return {
        todos: db.collection(this.userId).orderBy("createdAt", "desc")
      };
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

      addTodo() {
        db.collection(this.userId)
          .add({
            note: this.newNote,
            createdAt: new Date(),
            isActive: true,
            noteType
          })
          .then(res => {
            this.newNote = "";
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

      deleteNote(id) {
        db.collection(this.userId)
          .doc(id)
          .delete();
      },

      abandonChanges(id) {
        delete this.inEditModeObject[id];
        this.inEditModeObject = { ...this.inEditModeObject[id]
        };
      },

      switchToEditMode(index) {
        this.inEditModeObject = {
          ...this.inEditModeObject,
          [this.todos[index].id]: {
            changedNote: this.todos[index].note,
            inEditMode: true
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
      EndTimeNote
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
  .editInputWrapper {
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
</style>
