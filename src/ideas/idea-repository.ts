
import { BasicIdea, Concept, Idea, IdeaId, IdeaType, IdeaTypeMap, ToDo } from "./idea";
import { Draft, Persisted } from "../ts/draft";
import { Maybe } from "../ts/maybe";
import { Result } from "../ts/result";
import { equals, isNil } from "ramda";
import { pipe } from "../ts/pipe";
import { KeysOfUnion } from "../ts/union";

export class IdeaRepository {
    private ideasMap: Map<IdeaId, Idea> = new Map();
    private lastId: IdeaId = 0;

    store<IDEA extends Draft<Idea>>(ideaDraft: IDEA): Persisted<IDEA, IdeaId> {
        const nextId = this.createNextId();
        const idea: Idea = { ...ideaDraft, id: nextId };
        this.ideasMap.set(idea.id, idea);
        return { ...ideaDraft, id: nextId };
    }

    update(update: IdeaUpdate): Result<Changes, UpdateError> {
        const idea = this.ideasMap.get(update.id);
        if (isNil(idea)) {
            return Result.failure(UpdateError.IdeaDoesNotExist);
        }
        const updateResult = this.updateIdea(removeFieldsWithUndefinedValue(update), idea);

        return pipe(
            updateResult,
            Result.andThen(([updatedIdea, changes]) => {
                this.ideasMap.set(idea.id, updatedIdea);
                return Result.success(changes);
            })
        );
    }

    private updateIdea<U extends IdeaUpdate>(update: U, idea: IdeaTypeMap[U["type"]]): Result<[IdeaTypeMap[U["type"]], Changes], UpdateError> {
        if (idea.type !== update.type) {
            return Result.failure(UpdateError.InvalidDataForGivenType);
        }
        return Result.success([{ ...idea, ...update }, this.getChanges(update, idea)]);
    }

    private getChanges<U extends IdeaUpdate>(update: U, idea: IdeaTypeMap[U["type"]]): Changes {
        const entries = Object.entries(update) as [KeysOfUnion<U>, any][];
        return entries
            .map(([field, value]) => [field, !equals(value, idea[field as keyof IdeaTypeMap[U["type"]]])] as const)
            .filter(([_, wasChanged]) => wasChanged)
            .map(([field, _]) => field)
    }

    get(ideaId: IdeaId): Maybe<Idea> {
        const idea = this.ideasMap.get(ideaId);
        return Maybe.from(idea);
    }

    all(): Idea[] {
        return Array.from(this.ideasMap.values());
    }

    truncate(): void {
        this.ideasMap.clear();
    }

    private createNextId(): IdeaId {
        const nextId: IdeaId = this.lastId + 1;
        this.lastId = nextId;
        return nextId;
    }
}

type BasicIdeaUpdate = Partial<BasicIdea> & { id: IdeaId, type: IdeaType.BasicIdea };
type ToDoUpdate = Partial<ToDo> & { id: IdeaId, type: IdeaType.ToDo };
type ConceptUpdate = Partial<Concept> & { id: IdeaId, type: IdeaType.Concept };

export type IdeaUpdate = BasicIdeaUpdate | ToDoUpdate | ConceptUpdate;

export enum UpdateError {
    IdeaDoesNotExist = "IdeaDoesNotExist",
    CannotUpdateType = "CannotUpdateType",
    InvalidDataForGivenType = "InvalidDataForGivenType"
}

type Changes = KeysOfUnion<IdeaUpdate>[];

const removeFieldsWithUndefinedValue = <T>(obj: T): T => (
    Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined)) as T
);