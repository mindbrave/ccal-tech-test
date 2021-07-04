
import { NotificationService } from "../../notification-service";
import { IdeaType } from "../idea";
import { IdeaRepository } from "../idea-repository";
import { IdeaService } from "../idea-service";
import { expectThatIdea } from "./expectIdea";
import { instance, mock } from "ts-mockito";

describe(`Create idea tests`, () => {

    test("we can create Basic idea", () => {
        // When
        const createdIdea = new IdeaService(notificationService, ideaRepository).create({
            type: IdeaType.BasicIdea,
            title: "Test title",
            description: "Test description",
        });

        // Then
        expectThatIdea(createdIdea, ideaRepository)
            .isBasicIdea()
            .isTitled("Test title")
            .isDescribedWith("Test description");
    });

    test("we can create ToDo idea", () => {
        // When
        const createdIdea = new IdeaService(notificationService, ideaRepository).create({
            type: IdeaType.ToDo,
            title: "Test title",
            description: "Test description",
            done: false
        });

        // Then
        expectThatIdea(createdIdea, ideaRepository)
            .isAToDo()
            .isTitled("Test title")
            .isDescribedWith("Test description")
            .isNotDone();
    });

    test("we can create Concept idea", () => {
        // When
        const createdIdea = new IdeaService(notificationService, ideaRepository).create({
            type: IdeaType.Concept,
            title: "Test title",
            description: "Test description",
            references: ["http://example.com"],
            done: null,
        });

        // Then
        expectThatIdea(createdIdea, ideaRepository)
            .isAConcept()
            .isTitled("Test title")
            .isDescribedWith("Test description")
            .doneWasNotSpecified()
            .hasReferencesTo(["http://example.com"]);
    });

    test("Concept idea can specify done field", () => {
        // When
        const createdIdea = new IdeaService(notificationService, ideaRepository).create({
            type: IdeaType.Concept,
            title: "Test title",
            description: "Test description",
            done: true,
            references: ["http://example.com"]
        });

        // Then
        expectThatIdea(createdIdea, ideaRepository)
            .isDone();
    });

    let ideaRepository: IdeaRepository;
    let notificationService: NotificationService;

    beforeEach(() => {
        ideaRepository = new IdeaRepository();
        notificationService = instance(mock<NotificationService>());
    });
})

