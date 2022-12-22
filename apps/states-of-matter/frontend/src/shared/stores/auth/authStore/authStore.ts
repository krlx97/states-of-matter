import {writable} from "svelte/store";
import type {Auth} from "./authStore.models";

const authStore = writable<Auth>({
  signinForm: {
    name: "",
    password: ""
  },
  signupForm: {
    name: "",
    password: ""
  }
});

export {authStore};
