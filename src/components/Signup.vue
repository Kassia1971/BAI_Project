<template>
  <div class="container">
    <div class="row">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="text-center mb-5">BAI - Project</h2>
        <div class="panel panel-default">
          <div class="panel-heading mb-3">
            <h3 class="panel-title text-center">Create a new account</h3>
          </div>
          <div class="panel-body">
            <form accept-charset="UTF-8" role="form">
              <fieldset>
                <div class="form-group">
                  <input
                    type="text"
                    v-model="email"
                    placeholder="Add your email address"
                    class="input w-100"
                    required
                  >
                <p class="error" v-if='validationEmailError'>Invalid email format!</p>
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    v-model="password"
                    placeholder="Add your password"
                    class="input w-100"
                    required
                  >
                </div>
                <div class="row ml-0 mr-0 btn-wrapper">
                   <router-link to="/login"  class="p-0 mr-2"><button type='button' class="btn btn-md btn-primary btn-block">
                    Back
                  </button></router-link>
                  <button
                    v-on:click="signUp"
                    class="btn btn-md btn-success btn-block"
                    type="submit"
                  >Sign Up!</button>
                </div>
              </fieldset>
            </form>
             <p class="error" v-if='serverError'>{{this.serverError}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import {validator} from "./../services/validator";

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: "",
      validationEmailError: null,
      serverError: null
    };
  },
  methods: {
    signUp() {
      const {validEmail } = validator;

      if(!validEmail(this.email)){
        this.validationEmailError = true;
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(response => {
          this.$router.replace('/main')
        })
        .catch(err => {
          this.serverError = err.message;
        })
    }
  }
};
</script>

<style>
.btn-wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.error{
  color: red;
}

.d-flex {
  width: 100%;
  height: 100vh;
  margin-top: -8rem;
}

a button {
  color: white;
  text-decoration: none;
}

.row > a {
  width: 30%;
}

.row > button {
  width: calc(100% - 30% - 0.5rem);
}

a:hover button {
  color: white;
  text-decoration: none;
}
</style>
