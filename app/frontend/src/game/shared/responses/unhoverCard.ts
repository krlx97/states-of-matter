import type {Res} from "models";
import hoveredCardStore from "../stores/hoveredCardStore";

const unhoverCard: Res = () => {
  hoveredCardStore.set({
    field: ""
  });
};

export default unhoverCard;
