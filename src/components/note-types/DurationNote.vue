<template>
  <div class="todoElement">
    <div class="elementRow">
      <span>{{index+1}}.</span>
      <div class="elementInnerRow">
        <div :class=" isActive ? 'progressWrapper' : ''">
          <p
            class="d-inline"
            v-if="!inEditModeObject[todo.id]"
            :class="!todo.isActive ? 'inactiveEntry' : ''"
          >
            <b>{{ todo.note }}</b>
          </p>
          <b-progress v-if="isActive"  :value="value" :max="todo.duration" show-progress animated>
             <b-progress-bar class="progressBar" :value="value" :label="`${value}`"></b-progress-bar>
           </b-progress>
        </div>
        <div class="editInputWrapper" v-if="inEditModeObject[todo.id]">
          <b-form-input v-model="inEditModeObject[todo.id].changedNote"></b-form-input>
          <b-button-group class="editNoteButtonsGroup">
            <b-button
              variant="success"
              @click="updateNote(todo.id, inEditModeObject[todo.id].changedNote)"
            >
              <BIconFileCheck/>
            </b-button>
            <b-button variant="danger" @click="abandonChanges(todo.id)">
              <BIconX/>
            </b-button>
          </b-button-group>
        </div>
      </div>
      <b-button-group>
        <b-button
          v-if="!isActive"
          variant="info"
          :disabled="!todo.isActive || inEditModeObject[todo.id] !== undefined || todo.remainingDuration === 0 "
          @click="start(todo.id)"
        >
          <BIconPlayFill/>
        </b-button>
        <b-button v-if="isActive" variant="dark" @click="stop(todo.id)">
          <BIconStopFill/>
        </b-button>
        <b-button
          v-if="todo.isActive"
          variant="success"
          :disabled="!todo.isActive || inEditModeObject[todo.id] !== undefined || isActive"
          @click="endNote(todo.id)"
        >
          <BIconCheck/>
        </b-button>
        <b-button v-if="!todo.isActive" variant="primary" @click="revertNote(todo.id)">
          <BIconReply/>
        </b-button>
        <b-button
          variant="warning"
          :disabled="!todo.isActive || inEditModeObject[todo.id] !== undefined || isActive "
          @click="switchToEditModeFunction(index)"
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
    <div class="durationWrapper">
      <span>
        Original duration:
        <b>{{originalDuration}}</b> seconds
      </span>
      <span>
        Remaining duration:
        <b>{{isActive ? value : todo.remainingDuration}}</b>
      </span>
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
      <span v-if="todo.timeoutAt">
        Time out at:
        <b>{{todo.timeoutAt.toDate().toLocaleString() }}</b>
      </span>
      <span v-if="todo.endAt">
        Completed at:
        <b>{{todo.endAt.toDate().toLocaleString() }}</b>
      </span>
    </div>
  </div>
</template>

<script>
import { db } from "../../main";
export default {
  name: "DurationNote",
  props: [
    "todo",
    "index",
    "deleteNote",
    "switchToEditMode",
    "revertNote",
    "endNote",
    "abandonChanges",
    "updateNote",
    "inEditModeObject"
  ],
  data: function() {
    return {
      isActive: false,
      timer: null,
      value: null
    };
  },
  computed: {
    originalDuration: function() {
      return this.todo.duration;
    }
  },
  destroyed: function() {
    clearInterval(this.timer);
  },
  methods: {
    start: function() {
      if(this.todo.remainingDuration <= 0) {
        return
      }
      this.isActive = true;
      this.value = this.todo.remainingDuration;
      this.startTime();
    },
    stop: function() {
      this.isActive = false;
      clearInterval(this.timer);
      this.timer = null;
      this.sendRemainingValue()

    },
    switchToEditModeFunction: function(index) {
      this.stop();
      this.switchToEditMode(index);
    },
    startTime: function(){
      this.timer = setInterval(()=>{
         if (this.value < 1) {
         this.stop();
        }
        this.value--;
      },1000)
    },
    sendRemainingValue: function(){
      db.collection(this.$store.getters.userId)
        .doc(this.todo.id)
        .update({
          remainingDuration: this.value,
          timeoutAt: this.value === 0 ? new Date(): null
        });
        if(this.value === 0){
          this.endNote(this.todo.id);
        }
    }
  }
};
</script>

<style>
.durationWrapper {
  font-size: 0.7rem;
}

.progressWrapper{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}

.durationWrapper> span {
  margin-right: 0.5rem;
}

.progressWrapper > p {
  margin-bottom: 0;
}

.progress{
  min-width: 80%;
  margin: 0 auto;
}
</style>
