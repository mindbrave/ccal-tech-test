import { Idea, IdeaType, Url } from "../idea";
import { IdeaRepository } from "../idea-repository";
import * as Maybe from "../../ts/maybe";
import { expect } from "chai";
import { Result, ResultType } from "../../ts/result";

export const expectThatIdea = (idea: Idea, ideaRepository: IdeaRepository) => {
    const retrievedIdea = ideaRepository.get(idea.id);
    if (Maybe.isNothing(retrievedIdea)) {
        return fail("Idea wasn't created");
    }
    return {
        isBasicIdea: function () {
            expect(retrievedIdea.type).to.equal(IdeaType.BasicIdea);
            return this;
        },
        isAToDo: function () {
            expect(retrievedIdea.type).to.equal(IdeaType.ToDo);
            return this;
        },
        isAConcept: function () {
            expect(retrievedIdea.type).to.equal(IdeaType.Concept);
            return this;
        },
        isTitled: function (expectedTitle: string) {
            expect(retrievedIdea.title).to.equal(expectedTitle);
            return this;
        },
        isDescribedWith: function (expectedDescription: string) {
            expect(retrievedIdea.description).to.equal(expectedDescription);
            return this;
        },
        isNotDone: function () {
            switch (retrievedIdea.type) {
                case IdeaType.BasicIdea:
                    fail("Idea doesn't have done field");
                case IdeaType.ToDo:
                case IdeaType.Concept:
                    expect(retrievedIdea.done).to.be.false;
                    break;
            }
            return this;
        },
        isDone: function () {
            switch (retrievedIdea.type) {
                case IdeaType.BasicIdea:
                    fail("Idea doesn't have done field");
                case IdeaType.ToDo:
                case IdeaType.Concept:
                    expect(retrievedIdea.done).to.be.true;
                    break;
            }
            return this;
        },
        doneWasNotSpecified: function () {
            switch (retrievedIdea.type) {
                case IdeaType.BasicIdea:
                    fail("Idea doesn't have done field");
                case IdeaType.ToDo:
                case IdeaType.Concept:
                    expect(retrievedIdea.done).to.be.null;
                    break;
            }
            return this;
        },
        hasReferencesTo: function (expectedReferences: Url[]) {
            switch (retrievedIdea.type) {
                case IdeaType.BasicIdea:
                case IdeaType.ToDo:
                    fail("Idea is not a Concept");
                case IdeaType.Concept:
                    expect(retrievedIdea.references).to.deep.equal(expectedReferences);
                    break;
            }
        }
    }
}

export const expectFailureFromResultWithError = <ERR>(result: Result<unknown, ERR>, error: ERR): void => {
    switch (result.type) {
        case ResultType.Success:
            fail("Result succeeded");
        case ResultType.Failure:
            expect(error).to.deep.equal(result.error);
    }
}