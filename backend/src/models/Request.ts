import type {Services} from "./Services";

type Request<Params = {}> = (services: Services, params: Params) => Promise<void>;

export type {Request};
