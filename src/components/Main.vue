<template>
  <div>
    <header>
      <div class="header">
        <p>Logged as: <b>{{email}}</b></p>
        <button class="btn btn-md btn-primary btn-block logout" v-on:click="logout">Logout</button>
      </div>
    </header>
    <div>
      <Todos/>
      <hr>
      <Joke/>
    </div>
    <hr>
    <footer>
      <div class="conteiner footer">
        <p>BAI - Project</p>
        <p>Copyright © 2020 - All Rights Reserved</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ChuckNorrisService } from "../services/ChuckNorrisService";
import firebase from "firebase";

// Components
import Todos from './Todos';
import Joke from './Joke';

export default {
  name: "Main",
  data() {
    return {
      email: ''
    };
  },

  created: function () {
    const {uid, email} =  firebase.auth().currentUser
    this.email = email;
    this.$store.dispatch("setUserData", {uid, email});
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    }
  },

  components: {
    Todos,
    Joke
  },

};
</script>

<style>
  .footer {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center
  }

  .header{
    display: flex!important;
    justify-content: space-between!important;
    align-items: center!important;
  }
</style>
