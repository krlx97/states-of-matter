const regex = /^[a-z1-5.\s]*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
 
const isNameValid = (name: string): boolean => regex.test(name);
const isPasswordValid = (password: string): boolean => passwordRegex.test(password);

export {isNameValid, isPasswordValid};
