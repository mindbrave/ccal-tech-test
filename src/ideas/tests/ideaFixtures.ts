import { Draft } from "../../ts/draft";
import { Given, givenPipe } from "../../ts/pipe";
import { BasicIdea, Concept, Idea, IdeaType, ToDo, Url } from "../idea";
import { IdeaRepository } from "../idea-repository";

export const givenThereAreNoIdeasCreatedYet = (ideaRepository: IdeaRepository): void => ideaRepository.truncate();

export const givenBasicIdea = (ideasRepository: IdeaRepository, ...givens: Given<Draft<BasicIdea>>[]): BasicIdea => {
    const basic = givenPipe(
        {
            type: IdeaType.BasicIdea,
            title: "Default title",
            description: "Default description",
        },
        ...givens
    );
    const persistedBasic = ideasRepository.store(basic);
    return persistedBasic;
};

export const givenToDo = (ideasRepository: IdeaRepository, ...givens: Given<Draft<ToDo>>[]): ToDo => {
    const toDo = givenPipe(
        {
            type: IdeaType.ToDo,
            title: "Default title",
            description: "Default description",
            done: false,
        },
        ...givens
    );
    const persistedToDo = ideasRepository.store(toDo);
    return persistedToDo;
};

export const givenConcept = (ideasRepository: IdeaRepository, ...givens: Given<Draft<Concept>>[]): Concept => {
    const concept = givenPipe(
        {
            type: IdeaType.Concept,
            title: "Default title",
            description: "Default description",
            done: null,
            references: [],
        },
        ...givens
    );
    const persistedConcept = ideasRepository.store(concept);
    return persistedConcept;
};

export const thatIsTitled = (title: string) => <T extends Idea>(idea: Draft<T>): Draft<T> => ({
    ...idea,
    title
});

export const thatIsDescribedWith = (description: string) => <T extends Idea>(idea: Draft<T>): Draft<T> => ({
    ...idea,
    description
});

export const thatIsNotDone = <T extends ToDo | Concept>(idea: Draft<T>): Draft<T> => ({ ...idea, done: false });

export const thatIsDone = <T extends ToDo | Concept>(idea: Draft<T>): Draft<T> => ({ ...idea, done: true });

export const thatHasReferencesTo = (references: Url[]) => <T extends Concept>(idea: Draft<T>): Draft<T> => ({ ...idea, references });