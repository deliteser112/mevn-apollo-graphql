<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-form>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <h1>{{ headline }}</h1>
        </v-flex>
      </v-layout>
      <v-layout v-if="error" row wrap>
        <v-flex xs12 sm4>
          <form-alert :message="error.message"></form-alert>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-card color="secondary" dark>
            <v-container>
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="registerUser">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="username"
                                  :rules="usernameRules"
                                  prepend-icon="face"
                                  label="Username"
                                  type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="email"
                                  :rules="emailRules"
                                  prepend-icon="email"
                                  label="Email"
                                  type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="password"
                                  :rules="passwordRules"
                                  prepend-icon="extension"
                                  label="Password"
                                  type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field v-model="passwordConfirmation"
                                  :rules="passwordRules"
                                  prepend-icon="extension"
                                  label="Password"
                                  type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn :loading="loading" :disabled="!isFormValid" color="info" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                      Signin
                    </v-btn>
                    <h3>Already having an account?</h3>
                    <router-link class="text--primary font-weight-bold" to="/login">Log in
                    </router-link>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex';
  import default_data from './DefaultData.json'

  export default {
    name: "Register",
    data() {
      return {
        /////
        myJson:default_data,
        ////
        headline: 'Register',
        isFormValid: true,
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        emailRules: [
          email => !!email || 'E-mail is required',
          email => /.@+./.test(email) || 'E-mail must be valid'
        ],
        passwordRules: [
          password => !!password || "Password is required",
          password =>
            password.length >= 4 || "Password must be at least 4 characters",
          confirmation => confirmation === this.password || "Passwords must match"
        ],
        usernameRules: [
          username => !!username || "Username is required",
          username =>
            username.length >= 4 || "Username must be at least 4 characters"
        ]
      }
    },
    computed: {
      ...mapState(['user', 'error', 'loading'])
    },
    watch: {
      // if user values change, redirect to home
      user(value) {
        this.$router.push('/');
      }
    },
    methods: {
      registerUser() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('registerUser', {
            username: this.username,
            email: this.email,
            password: this.password
          })
        }
      }
    }
  };
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
