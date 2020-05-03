<template>
  <div class="container text-center">
    <h4 class="mb-4">Chunk Norris jokes</h4>
    <p><b>{{joke}}</b></p>
    <p >Wait <span v-if="time > 0">{{time}}  seconds for a new joke or</span></p>
    <b-button variant="success" @click="searchRandomJoke">Search new now</b-button>
  </div>
</template>

<script>
import { ChuckNorrisService } from "../services/ChuckNorrisService";
import { setInterval } from 'timers';

export default {
  name: 'Joke',
  data() {
    return {
      joke: "No joke to display",
      time: 0
    };
  },

  created: function(){
    this.startRandomJoke()
  },

  methods: {
    startRandomJoke() {
      setInterval(()=>{
        if(this.time === 0){
          this.time = null;
          this.searchRandomJoke();
        } else {
          this.time = this.time -1;
        }
      }, 1000)
    },

    searchRandomJoke() {
      ChuckNorrisService.getRandom()
        .then(response => {
          this.joke = response.data.value.joke;
          this.time = 20
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style>
.list {
  text-align: left;

  max-width: 750px;

  margin: auto;
}
</style>
