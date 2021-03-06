import {writable} from "svelte/store";
import type {Writable} from "svelte/store";
import type {Auth} from "./authStore.models";

export const authStore: Writable<Auth> = writable({
  signinForm: {
    username: "",
    password: ""
  },
  signupForm: {
    username: "",
    password: ""
  }
});
