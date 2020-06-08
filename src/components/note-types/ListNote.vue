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
                  <ul>
                    <li v-for="(element, index) in todo.elements" :key="index">{{element.value}}</li>
                  </ul>
                </p>
                <div
                  class="editInputWrapperInList"
                  v-if="inEditModeObject[todo.id]"
                >
                <div class="editInputMain">
                  <b-form-input v-model="inEditModeObject[todo.id].changedNote"></b-form-input>
                </div>
                <div>
                  <div v-for="(element, index) in todo.elements" :key="index" class="editInputElement" >
                    <b-form-input v-model="inEditModeObject[todo.id].elements[index].value"></b-form-input>
                  </div>
                </div>
                <b-button-group class="editNoteButtonsGroup">
                    <b-button
                      variant="success"
                      @click="updateNote(todo.id, inEditModeObject[todo.id])"
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
  name: "ListNote",
  props: ['todo', 'index', 'deleteNote', 'switchToEditMode', 'revertNote', 'endNote' ,'abandonChanges', 'updateNote' , 'inEditModeObject']
}
</script>

<style>
.editInputMain, .editInputElement{
   margin: 0 auto;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
}

.editInputElement > input {
  margin-left: 5rem;
  margin-top: 0.5rem;
}

.editInputWrapperInList{
  margin: 1rem 0;
}
.editInputWrapperInList .editNoteButtonsGroup {
  margin: 1rem auto 0 auto;
  max-width: 100%;
  margin-left: calc(50% - 200px);
}
</style>
