<template>
  <div class="container">
    <div class="row">
      <div class="d-flex flex-column justify-content-center align-items-center">
        <h2 class="text-center mb-5">BAI - Project</h2>
        <div class="panel panel-default">
          <div class="panel-heading mb-3">
            <h3 class="panel-title text-center">Please sign in</h3>
          </div>
          <div class="panel-body">
            <form accept-charset="UTF-8" role="form">
              <fieldset>
                <div class="form-group">
                  <input
                    type="text"
                    v-model="email"
                    placeholder="Email address"
                    class="input w-100"
                    required
                  >
                  <p class="error" v-if='validationEmailError'>Invalid email format!</p>
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    class="input w-100"
                    required
                  >
                </div>
                <input
                  v-on:click="login"
                  class="btn w-100 btn-md btn-success btn-block"
                  type="submit"
                  value="Login"
                >
              </fieldset>
            </form>
            <p class="error" v-if='serverError'>{{this.serverError}}</p>
          </div>
          <p class="mt-3">
            <router-link to="/signup">New Here? Create a new account</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import {validator} from "./../services/validator";

export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: "",
      validationEmailError: null,
      serverError: null
    };
  },
  methods: {
    login() {
      const {validEmail } = validator;

      if(!validEmail(this.email)){
        this.validationEmailError = true;
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
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
.d-flex {
  width: 100%;
  height: 100vh;
  margin-top: -8rem;
}

.error{
  color: red;
}
</style>
