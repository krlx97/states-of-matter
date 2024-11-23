import {isAddress, parseUnits} from "ethers";
import {playerStore} from "stores";
import {get, writable, type Writable} from "svelte/store";

type Validator = "name" | "password" | "currency" | "item" | "address" | "craft" | "craft2" | "approval";

type FormField = {
  value: string;
  error: string;
  validator: Validator;
  balance: bigint | undefined;
  balance2: bigint | undefined;
  price: bigint | undefined;
  price2: bigint | undefined;
};

type FieldData = [string, Validator, bigint?, bigint?, bigint?, bigint?];

interface Form<K extends string> {
  fields: Record<K, FormField>;
  isDisabled: boolean;
  isLoading: boolean;
}

const isEmpty = (value: string): boolean => value === "";
const isInvalidNumber = (value: string): boolean => !/^-?\d*[\.]?\d+$/.test(value);
const isInvalidDecimals = (value: string): boolean => (value.split(".")[1] || []).length > 18;
const isNoDecimals = (value: string): boolean => (value.split(".")[1] || []).length > 0;
const isNegative = (value: bigint): boolean => value <= 0;
const isLessThan0 = (value: bigint): boolean => value < 0;
const isSufficientBalance = (balance: bigint, value: bigint): boolean => balance - value < 0;

const validateName = (name: string): string => {
  if (name.length <= 0) {
    return "Mustn't be empty";
  }

  if (name.length < 3) {
    return "Minimum 3 characters";
  }

  if (name.length > 16) {
    return "Maximum 16 characters";
  }

  return "";
};

const validatePassword = (password: string): string => {
  if (password.length <= 0) {
    return "Mustn't be empty";
  }

  if (password.length < 6) {
    return "Minimum 6 characters";
  }

  if (password.length > 32) {
    return "Maximum 32 characters";
  }

  return "";
};

const validateAddress = (address: string): string => {
  if (address.length <= 0) {
    return "Mustn't be empty";
  }

  if (!isAddress(address)) {
    return "Invalid address format";
  }

  if (address.toLowerCase() === get(playerStore).address.toLowerCase()) {
    return "Can't transfer to self";
  }

  return "";
};

const validateCurrency = (balance: bigint | undefined, value: string): string => {
  if (isEmpty(value)) {
    return "Mustn't be empty";
  }

  if (isInvalidNumber(value)) {
    return "Invalid number format";
  }

  if (isInvalidDecimals(value)) {
    return "Up to 18 decimal places allowed";
  }

  const amt = parseUnits(value);

  if (isNegative(amt)) {
    return "Must be positive";
  }

  if (balance !== undefined && isSufficientBalance(balance, amt)) {
    return "Insufficient balance";
  }

  return "";
};

const validateItem = (balance: bigint | undefined, value: string): string => {
  if (isEmpty(value)) {
    return "Mustn't be empty";
  }

  if (isInvalidNumber(value)) {
    return "Invalid number format";
  }

  if (isNoDecimals(value)) {
    return "No decimals allowed";
  }

  const amt = BigInt(value);

  if (isNegative(amt)) {
    return "Must be positive";
  }

  if (balance !== undefined && balance - amt < 0) {
    return "Insufficient balance";
  }

  return "";
};

const validateCraft = (balance: bigint | undefined, value: string, price: bigint | undefined): string => {
  if (isEmpty(value)) {
    return "Mustn't be empty";
  }

  if (isInvalidNumber(value)) {
    return "Invalid number format";
  }

  if (isNoDecimals(value)) {
    return "No decimals allowed";
  }

  const amt = BigInt(value);

  if (isNegative(amt)) {
    return "Must be positive";
  }

  if (balance !== undefined && isSufficientBalance(balance, amt * price)) {
    return "Insufficient balance";
  }

  return "";
};

const validateCraft2 = (
  balance: bigint | undefined,
  balance2: bigint | undefined,
  value: string,
  price: bigint | undefined,
  price2: bigint | undefined): string => {
  if (isEmpty(value)) {
    return "Mustn't be empty";
  }

  if (isInvalidNumber(value)) {
    return "Invalid number format";
  }

  if (isNoDecimals(value)) {
    return "No decimals allowed";
  }

  const amt = BigInt(value);

  if (isNegative(amt)) {
    return "Must be positive";
  }

  if (balance !== undefined && isSufficientBalance(balance, amt * price)) {
    return "Insufficient ECR balance";
  }

  if (balance2 !== undefined && isSufficientBalance(balance2, amt * price2)) {
    return "Insufficient Shards balance";
  }

  return "";
};

const validateApproval = (approval: bigint | undefined, value: string): string => {
  if (isEmpty(value)) {
    return "Mustn't be empty";
  }

  if (isInvalidNumber(value)) {
    return "Invalid number format";
  }

  if (isInvalidDecimals(value)) {
    return "Up to 18 decimal places allowed";
  }

  const amt = parseUnits(value);

  if (isLessThan0(amt)) {
    return "Can't be less than 0";
  }

  return "";
};

const create = <K extends string>(obj: Record<K, FieldData>): Writable<Form<K>> => {
  const fields = Object.keys(obj).reduce((acc, key) => {
    acc[key] = {
      value: obj[key][0],
      error: "",
      validator: obj[key][1],
      balance: obj[key][2],
      price: obj[key][3],
      balance2: obj[key][4], // used for crafting, where users pay with 2 currencise
      price2: obj[key][5], // used for crafting, where users pay with 2 currencise
    };
    return acc;
  }, {}) as Record<K, FormField>;

  return writable({fields, isDisabled: true, isLoading: false});
};

const validate = (formStore: Writable<any>): void => {
  formStore.update((form) => {
    const {fields} = form;

    Object.keys(fields).forEach((key) => {
      const field = fields[key];

      if (field.validator === "name") {
        field.error = validateName(field.value);
      } else if (field.validator === "password") {
        field.error = validatePassword(field.value);
      } else if (field.validator === "currency") {
        field.error = validateCurrency(field.balance, field.value);
      } else if (field.validator === "address") {
        field.error = validateAddress(field.value);
      } else if (field.validator === "item") {
        field.error = validateItem(field.balance, field.value)
      } else if (field.validator === "craft") {
        field.error = validateCraft(field.balance, field.value, field.price);
      } else if (field.validator === "craft2") {
        field.error = validateCraft2(field.balance, field.balance2, field.value, field.price, field.price2);
      } else if (field.validator === "approval") {
        field.error = validateApproval(field.balance, field.value);
      }
    });

    form.isDisabled = Object.keys(fields).some((key): boolean => fields[key].error !== "");

    return form;
  });
};

const formService = {create, validate};

export {formService};
