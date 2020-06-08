<template>
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
          v-if="todo.isActive"
          variant="success"
          :disabled="inEditModeObject[todo.id] !== undefined "
          @click="endNote(todo.id)"
        >
          <BIconCheck/>
        </b-button>
        <b-button v-if="!todo.isActive" variant="primary" @click="revertNote(todo.id)">
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
    <div class="endWrapper">
      <span class="endTimeWrapper" :class="timerClass" v-if="timer">
        Task should be completed in:
        <b>{{timeToEnd}}</b>
      </span>
      <span class="endTimeWrapper" :class="timerClass" v-else>Task time is over</span>
    </div>
    <div class="timeWrapper">
      <span>
        Created at:
        <b>{{todo.createdAt.toDate().toLocaleString()}}</b>
      </span>
      <span>
        Planned ending at:
        <b>{{todo.endTime.toDate().toLocaleString()}}</b>
      </span>
      <span v-if="todo.modifiedAt">
        Modified at:
        <b>{{todo.modifiedAt.toDate().toLocaleString() }}</b>
      </span>
      <span v-if="todo.remindAt">
        Reminder wos sent at:
        <b>{{todo.remindAt.toDate().toLocaleString() }}</b>
      </span>
      <span v-if="todo.endAt">
        Completed at:
        <b>{{todo.endAt.toDate().toLocaleString() }}</b>
      </span>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { db } from "../../main";
import { sendMail } from "./../../services/email.service.js";
export default {
  name: "EndTimeNote",
  created: function() {
    const endTime = moment(this.todo.endTime.toDate());
    const now = moment(new Date());
    const duration = moment.duration(endTime.diff(now));
    this.sec = duration.asSeconds();
    if (this.sec > 0) {
      this.startTimer();
    }
  },
  data: function() {
    return {
      timeToEnd: "",
      timer: null,
      sec: "",
      timerClass: "basicTimerClass",
      minSec: 15 * 60
    };
  },

  computed: {
    remindTime: function() {
      return this.sec < 15 * 60;
    },

    endTime: function() {
      return this.sec < 1;
    }
  },

  destroyed: function() {
    clearInterval(this.timer);
  },

  watch: {
    todo: function() {
      if (!this.todo.isActive && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      if (this.todo.isActive && !this.timer) {
        this.startTimer();
      }
    }
  },

  methods: {
    isTimeToAction: function() {
      if (!this.todo.isReminderSent && this.sec < this.minSec) {
        this.sentRemind();
      }

      this.setClass();
    },
    sentRemind: function() {
      const user = this.$store.getters.userEmail;
      sendMail(user);
      this.updateReminder();
    },
    setClass: function() {
      if (
        !this.endTime &&
        !this.remindTime &&
        this.timerClass !== "basicTimerClass"
      ) {
        this.timerClass = "basicTimerClass";
      } else if (
        !this.endTime &&
        this.remindTime &&
        this.timerClass !== "remindTimerClass"
      ) {
        this.timerClass = "remindTimerClass";
      } else if (
        this.endTime &&
        this.remindTime &&
        this.timerClass !== "endTimerClass"
      ) {
        this.timerClass = "endTimerClass";
      }
    },
    startTimer: function() {
      if (!this.todo.isActive) {
        return;
      }

      this.timer = setInterval(() => {
        if (this.sec <= 0) {
          clearInterval(this.timer);
          this.timer = null;
        }
        const endTime = moment(this.todo.endTime.toDate());
        const now = moment(new Date());
        const duration = moment.duration(endTime.diff(now));
        this.sec = duration.asSeconds();
        const days =
          duration.get("days") > 0 ? duration.get("days") + " days" : "";
        const hours =
          duration.get("hours") < 10
            ? `0${duration.get("hours")}`
            : duration.get("hours");
        const minutes =
          duration.get("minutes") < 10
            ? `0${duration.get("minutes")}`
            : duration.get("minutes");
        const seconds =
          duration.get("seconds") < 10
            ? `0${duration.get("seconds")}`
            : duration.get("seconds");
        this.timeToEnd = `${days} ${duration.get(
          "hours"
        )}:${minutes}:${seconds}`;
        this.isTimeToAction();
      }, 1000);
    },
    updateReminder() {
      db.collection(this.$store.getters.userId)
        .doc(this.todo.id)
        .update({
          remindAt: new Date(),
          isReminderSent: true
        });
    }
  },

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
  ]
};
</script>

<style>
.endTimeWrapper {
  font-size: 0.7rem;
}

.endTimerClass {
  color: red;
}

.remindTimerClass {
  color: orange;
}
</style>
