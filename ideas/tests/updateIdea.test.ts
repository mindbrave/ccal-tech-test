

import { NotificationService } from "../../notification-service";
import { IdeaType } from "../idea";
import { IdeaRepository, UpdateError } from "../idea-repository";
import { IdeaService } from "../idea-service";
import { expectFailureFromResultWithError, expectThatIdea } from "./expectIdea";
import { anything, instance, mock, verify } from "ts-mockito";
import { givenBasicIdea, givenConcept, givenThereAreNoIdeasCreatedYet, givenToDo, thatHasReferencesTo, thatIsDescribedWith, thatIsDone, thatIsNotDone, thatIsTitled } from "./ideaFixtures";

describe(`Update idea tests`, () => {

    /*
    
    dont notify on update to title on todo

    */

    test("can update just title in basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository,
            thatIsTitled("Title before update"),
            thatIsDescribedWith("This shouldn't be updated")
        );

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            title: "Updated title",
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isTitled("Updated title")
            .isDescribedWith("This shouldn't be updated");
    });

    test("can update just description in basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository,
            thatIsTitled("This shouldn't be updated"),
            thatIsDescribedWith("Description before update")
        );

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            description: "Updated description",
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isTitled("This shouldn't be updated")
            .isDescribedWith("Updated description");
    });

    test("can update title and description in basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository,
            thatIsTitled("Title before update"),
            thatIsDescribedWith("Description before update")
        );

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            title: "Updated title",
            description: "Updated description",
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isTitled("Updated title")
            .isDescribedWith("Updated description");
    });

    test("can update done field in todo", () => {
        // Given
        const idea = givenToDo(ideaRepository, thatIsNotDone);

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.ToDo,
            done: true
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isDone();
    });

    test("can update done field in concept", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatIsNotDone);

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            done: true
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isDone();
    });

    test("can update done field in concept to unspecified", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatIsDone);

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            done: null,

        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .doneWasNotSpecified();
    });

    test("can update references in concept", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatHasReferencesTo(["http://example.com"]));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            references: ["http://example.com", "http://example2.com"]
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .hasReferencesTo(["http://example.com", "http://example2.com"]);
    });

    test("updating field with undefined value won't change it", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatIsTitled("Test title"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            title: undefined
        });

        // Then
        expectThatIdea(idea, ideaRepository)
            .isTitled("Test title");
    });

    test("return error if trying to update non existing idea", () => {
        // Given
        givenThereAreNoIdeasCreatedYet(ideaRepository);

        // When
        const result = new IdeaService(notificationService, ideaRepository).update({
            id: 1,
            type: IdeaType.BasicIdea,
            title: "Some title"
        });

        // Then
        expectFailureFromResultWithError(result, UpdateError.IdeaDoesNotExist);
    });

    test("return error if trying to update todo with invalid data", () => {
        // Given
        const idea = givenToDo(ideaRepository);

        // When
        const result = new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            references: ["http://example.com"]
        });

        // Then
        expectFailureFromResultWithError(result, UpdateError.InvalidDataForGivenType);
    });

    test("return error if trying to update concept with invalid data", () => {
        // Given
        const idea = givenConcept(ideaRepository);

        // When
        const result = new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.ToDo,
            done: true,
        });

        // Then
        expectFailureFromResultWithError(result, UpdateError.InvalidDataForGivenType);
    });

    test("notification is send when title is changed on basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository, thatIsTitled("Title before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            title: "Changed title"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).once();
    });

    test("notification is not send when description is changed on basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository, thatIsDescribedWith("Description before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            description: "Changed description"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is not send when title is in update but didn't change on basic idea", () => {
        // Given
        const idea = givenBasicIdea(ideaRepository, thatIsTitled("Title before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            title: "Title before change"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is send when done is changed on todo", () => {
        // Given
        const idea = givenToDo(ideaRepository, thatIsNotDone);

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.ToDo,
            done: true
        });

        // Then
        verify(notificationServiceMock.notify(anything())).once();
    });

    test("notification is not send when title is changed on todo", () => {
        // Given
        const idea = givenToDo(ideaRepository, thatIsTitled("Title before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.ToDo,
            title: "Changed title"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is not send when description is changed on todo", () => {
        // Given
        const idea = givenToDo(ideaRepository, thatIsDescribedWith("Description before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.ToDo,
            description: "Changed description"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is not send when done is in update but didn't change on todo", () => {
        // Given
        const idea = givenToDo(ideaRepository, thatIsNotDone);

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.BasicIdea,
            done: false
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is send when references are changed on concept", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatHasReferencesTo(["http://example.com"]));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            references: ["http://example.com", "http://example2.com"]
        });

        // Then
        verify(notificationServiceMock.notify(anything())).once();
    });

    test("notification is not send when description is changed on concept", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatIsDescribedWith("Description before change"));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            description: "Changed description"
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });

    test("notification is not send when references are in update but didn't change on concept", () => {
        // Given
        const idea = givenConcept(ideaRepository, thatHasReferencesTo(["http://example.com"]));

        // When
        new IdeaService(notificationService, ideaRepository).update({
            id: idea.id,
            type: IdeaType.Concept,
            references: ["http://example.com"]
        });

        // Then
        verify(notificationServiceMock.notify(anything())).never();
    });


    let ideaRepository: IdeaRepository;
    let notificationService: NotificationService;
    let notificationServiceMock: NotificationService;

    beforeEach(() => {
        ideaRepository = new IdeaRepository();
        notificationServiceMock = mock<NotificationService>();
        notificationService = instance(notificationServiceMock);
    });
})

