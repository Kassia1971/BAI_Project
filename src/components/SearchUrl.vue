<template>

          <button class="btn btn-outline-secondary" type="button"
            @click="searchRandom"
          >
            Search
          </button>


</template>

<script>
import ChuckNorrisService from "../services/ChuckNorrisService";

export default {
  data() {
    return {
      value: 'no message'
    };
  },
  methods: {
    searchRandom() {
      ChuckNorrisService.getRandom()
        .then(response => {
          this.value = response.data.value.joke;
          this.$store.dispatch('setJoke', response.data.value.joke)
          console.log(response.data.value.joke);
          this.$router.replace('/todos')
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
