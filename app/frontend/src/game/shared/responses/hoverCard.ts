import type { HoverCardRes } from "@som/shared/interfaces/responses";
import type { Res } from "models";
import hoveredCardStore from "../stores/hoveredCardStore";

const hoverCard: Res<HoverCardRes> = (params) => {
  hoveredCardStore.set(params);
};

export default hoverCard;
