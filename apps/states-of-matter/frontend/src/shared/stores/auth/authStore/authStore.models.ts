export interface SigninForm {
  name: string;
  password: string;
}

export interface SignupForm {
  name: string;
  password: string;
  repeatPassword: string;
}

export interface Auth {
  signinForm: SigninForm;
  signupForm: SignupForm;
}
