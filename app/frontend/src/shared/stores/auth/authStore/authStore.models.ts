export interface SigninForm {
  username: string;
  password: string;
}

export interface SignupForm {
  username: string;
  password: string;
}

export interface Auth {
  signinForm: SigninForm;
  signupForm: SignupForm;
}
