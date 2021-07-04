
import { DistributiveOmit } from "./omit";

export type Draft<ENTITY> = DistributiveOmit<ENTITY, "id">;

export type Persisted<ENTITY, ID> = ENTITY & { id: ID };