interface SigninForm {
  username: string;
  password: string;
}

interface SignupForm {
  username: string;
  password: string;
}

interface Auth {
  signinForm: SigninForm;
  signupForm: SignupForm;
}

export type {Auth};