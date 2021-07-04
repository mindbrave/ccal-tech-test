
import { Flavor } from "../ts/flavor";
import { Maybe } from "../ts/maybe";
import { MapDiscriminatedUnion } from "../ts/union";

export enum IdeaType {
    BasicIdea = "BasicIdea",
    ToDo = "ToDo",
    Concept = "Concept"
}

export type IdeaId = Flavor<number, "IdeaId">;

type BaseIdea = { type: IdeaType, id: IdeaId, title: string, description: string }

export type BasicIdea = BaseIdea & { type: IdeaType.BasicIdea };

export type ToDo = BaseIdea & { type: IdeaType.ToDo, done: boolean }

export type Url = string;

export type Concept = BaseIdea & { type: IdeaType.Concept, done: Maybe<boolean>, references: Url[] }

export type Idea = BasicIdea | ToDo | Concept;

export type IdeaTypeMap = MapDiscriminatedUnion<Idea, "type">

export const isIdeaOfType = <T extends IdeaType>(type: T) => (idea: Idea): idea is IdeaTypeMap[T] => {
    return idea.type === type;
}