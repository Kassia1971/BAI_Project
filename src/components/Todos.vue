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
        </form>
      </div>
      <div class="todoWrapper">
        <h4 class="text-center">Tasks To-Do:</h4>
        <article v-for="(todo, index) in todos" :key="index">
          <div class="todoElement">
            <div class="elementRow">
              <span>{{index+1}}.</span>
              <div class="elementInnerRow">
                <p
                  class="d-inline"
                  v-if="!inEditModeObject[todo.id]"
                  :class="!todo.isActive ? 'inactiveEntry' : ''"
                >
                  <b>{{ todo.note }}</b>
                </p>
                <div
                  class="editInputWrapper"
                  v-if="inEditModeObject[todo.id]"
                >
                  <b-form-input v-model="inEditModeObject[todo.id].changedNote"></b-form-input>
                  <b-button-group class="editNoteButtonsGroup">
                    <b-button
                      variant="success"
                      @click="updateNote(todo.id, inEditModeObject[todo.id].changedNote)"
                    >
                      <BIconFileCheck/>
                    </b-button>
                    <b-button
                      variant="danger"
                      @click="abandonChanges(todo.id)"
                    >
                      <BIconX/>
                    </b-button>
                  </b-button-group>
                </div>
              </div>
              <b-button-group>
                <b-button
                  v-if="todo.isActive"
                  variant="success"
                  :disabled="inEditModeObject[todo.id] !== undefined "
                  @click="endNote(todo.id)"
                >
                  <BIconCheck/>
                </b-button>
                <b-button
                  v-if="!todo.isActive"
                  variant="primary"
                  @click="revertNote(todo.id)"
                >
                  <BIconReply/>
                </b-button>
                <b-button
                  variant="warning"
                  :disabled="!todo.isActive || inEditModeObject[todo.id] !== undefined "
                  @click="switchToEditMode(index)"
                >
                  <BIconPencil/>
                </b-button>
                <b-button
                  variant="danger"
                  :disabled="inEditModeObject[todo.id] !== undefined "
                  @click="deleteNote(todo.id)"
                >
                  <BIconTrash/>
                </b-button>
              </b-button-group>
            </div>
            <div class="timeWrapper">
              <span>
                Created at:
                <b>{{todo.createdAt.toDate().toLocaleString()}}</b>
              </span>
              <span v-if="todo.modifiedAt">
                Modified at:
                <b>{{todo.modifiedAt.toDate().toLocaleString() }}</b>
              </span>
              <span v-if="todo.endAt">
                Completed at:
                <b>{{todo.endAt.toDate().toLocaleString() }}</b>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../main";
import {
  BIconTrash,
  BIconPencil,
  BIconCheck,
  BIconReply,
  BIconX,
  BIconFileCheck
} from "bootstrap-vue";

export default {
  name: "Todo",

  data() {
    return {
      todos: [],
      inEditModeObject: {},
      newNote: "",
      userId: this.$store.getters.userId
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

    addTodo() {
      db.collection(this.userId)
        .add({ note: this.newNote, createdAt: new Date(), isActive: true })
        .then(res => {
          this.newNote = "";
        })
        .catch(err => {
          alert(err.message);
        });
    },

    updateNote(id, newNote) {
      delete this.inEditModeObject[id]

      db.collection(this.userId)
        .doc(id)
        .update({ modifiedAt: new Date(), note: newNote });
    },

    deleteNote(id) {
      db.collection(this.userId)
        .doc(id)
        .delete();
    },

    abandonChanges(id) {
      delete this.inEditModeObject[id];
      this.inEditModeObject = {...this.inEditModeObject[id]}
    },

    switchToEditMode(index) {
      this.inEditModeObject = {
        ...this.inEditModeObject,
        [this.todos[index].id]: {
            changedNote: this.todos[index].note,
            inEditMode: true
          }
      }
    },

    endNote(id) {
      db.collection(this.userId)
        .doc(id)
        .update({ isActive: false, endAt: new Date() });
    },

    revertNote(id) {
      db.collection(this.userId)
        .doc(id)
        .update({ isActive: true, endAt: null });
    }
  },
  components: {
    BIconTrash,
    BIconPencil,
    BIconCheck,
    BIconReply,
    BIconX,
    BIconFileCheck
  }
};
</script>

<style>
.logout {
  width: auto;
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

.form-group > * {
  display: block;
}

.editInputWrapper {
  width: 100%;
}

.inputsWrapper,
.elementRow,
.editInputWrapper {
  margin: 0 auto;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

.addNoteInput {
  width: 100%;
  margin-right: 2rem;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
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

.timeWrapper > span {
  margin-right: 0.5rem;
}

.editNoteButtonsGroup {
  margin-left: 1rem;
  max-width: 100px;
}
</style>
