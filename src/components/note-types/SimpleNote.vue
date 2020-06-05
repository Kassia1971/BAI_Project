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
</template>

<script>

export default {
  name: "SimpleNote",
  props: ['todo', 'index', 'deleteNote', 'switchToEditMode', 'revertNote', 'endNote' ,'abandonChanges', 'updateNote' , 'inEditModeObject']
}
</script>

<style>
</style>
