import {writable} from "svelte/store";

import type {Writable} from "svelte/store";
import type {Auth} from "models/data";

const auth: Writable<Auth> = writable({
  signinForm: {
    username: "",
    password: ""
  },
  signupForm: {
    username: "",
    password: ""
  }
});

export default auth;
