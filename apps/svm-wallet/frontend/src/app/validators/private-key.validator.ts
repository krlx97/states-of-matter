import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import type {SvmService} from "services/svm.service";

export const privateKeyValidator = (svmService: SvmService): ValidatorFn => {
  return (control: AbstractControl) : ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const privateKeyValid = svmService.isValidPrivate(value);

    return !privateKeyValid ? {privateKeyValid: true} : null;
  };
};
