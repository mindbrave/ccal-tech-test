
import { NotificationService } from "../../notification-service";
import { IdeaType } from "../idea";
import { IdeaRepository } from "../idea-repository";
import { IdeaService } from "../idea-service";
import { instance, mock } from "ts-mockito";
import { givenConcept, givenThereAreNoIdeasCreatedYet, givenToDo } from "./ideaFixtures";
import { expect } from "chai";
import { expectThatIdea } from "./expectIdea";

describe(`Get ideas by type tests`, () => {

    test("return no ideas if there are no created yet", () => {
        // Given
        givenThereAreNoIdeasCreatedYet(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.ToDo);

        // Then
        expect(ideas).to.be.empty;
    });

    test("return no ideas if there are only ideas of other types", () => {
        // Given
        givenConcept(ideaRepository);
        givenConcept(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.ToDo);

        // Then
        expect(ideas).to.be.empty;
    });

    test("return one todo idea if there was one todo created", () => {
        // Given
        givenToDo(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.ToDo);

        // Then
        expect(ideas).to.have.length(1);
        expectThatIdea(ideas[0], ideaRepository).isAToDo();
    });

    test("return one concept idea if there was one concept created", () => {
        // Given
        givenConcept(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.Concept);

        // Then
        expect(ideas).to.have.length(1);
        expectThatIdea(ideas[0], ideaRepository).isAConcept();
    });

    test("return two todos if there were two todos created", () => {
        // Given
        givenToDo(ideaRepository);
        givenToDo(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.ToDo);

        // Then
        expect(ideas).to.have.length(2);
    });

    test("return two todos if there were two todos created and two concepts", () => {
        // Given
        givenToDo(ideaRepository);
        givenToDo(ideaRepository);
        givenConcept(ideaRepository);
        givenConcept(ideaRepository);

        // When
        const ideas = new IdeaService(notificationService, ideaRepository).getAllByType(IdeaType.ToDo);

        // Then
        expect(ideas).to.have.length(2);
    });

    let ideaRepository: IdeaRepository;
    let notificationService: NotificationService;

    beforeEach(() => {
        ideaRepository = new IdeaRepository();
        notificationService = instance(mock<NotificationService>());
    });
});
