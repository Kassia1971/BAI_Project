<template>
  <div>
    <button class="button logout" v-on:click="logout">Logout</button>
    <article class="covers" v-for="(todo, idx) in todos" :key="idx">
      <div>
        <h2>{{ todo.name }}</h2>
Link:  <a @click="myFunction(todo.url)">{{todo.url}}</a>

        <p>  <button class="button" @click="deleteTodo(todo.id)">
          Delete
        </button>
        </p>
      </div>
    </article>

    <form @submit="addTodo(name, url)">
      <h2>Add link</h2>
      <input v-model="name" placeholder="Name" class="input" required>
      <input v-model="url" placeholder="URL" class="input" required>
      <button type="submit" class="button">Add New Todo</button>
    </form>
    <button @click="search()" class="button">Search for new url</button>

    </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '../main'
export default {
  name: 'Todos',
  data () {
    return {
      todos: [],
      name: '',
      url: ''
    }
  },
  firestore () {
    let joke = this.$store.getters.joke,
        userId = this.$store.getters.userId;

    console.log(joke)
    if(joke){
      this.url = joke
    }

    return {
      todos: db.collection(userId).orderBy('createdAt')
    }
  },
  methods: {
    addTodo (name, url) {
      const createdAt = new Date(),
            userId = this.$store.getters.userId
      db.collection(userId).add({ name, url, createdAt })
      // Clear values
      this.name = ''
      this.url = ''
    },
    search () {
      this.$router.replace('searchUrl')
    },
    deleteTodo (id) {
      db.collection(this.$store.getters.userId).doc(id).delete()
    },
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>
