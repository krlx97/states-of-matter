import {miscService} from "shared/services";

interface Params { msg: string; }

const pushNotification = (params: Params): void => {
  miscService.showNotification(params.msg);
};

export default pushNotification;
