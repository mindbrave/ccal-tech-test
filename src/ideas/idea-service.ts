import { Idea, IdeaId, IdeaType, IdeaTypeMap, isIdeaOfType } from "./idea";
import { IdeaRepository, IdeaUpdate, UpdateError, } from "./idea-repository";
import { NotificationService } from "../notification-service";
import { Draft, Persisted } from "../ts/draft";
import { Result } from "../ts/result";
import { pipe } from "../ts/pipe";
import { any } from "ramda";

export class IdeaService {
  constructor(private readonly notificationService: NotificationService, private readonly ideaRepository: IdeaRepository) { }

  create<IDEA extends Draft<Idea>>(ideaDraft: IDEA): Persisted<IDEA, IdeaId> {
    return this.ideaRepository.store(ideaDraft);
  }

  update(update: IdeaUpdate): Result<void, UpdateError> {
    return pipe(
      this.ideaRepository.update(update),
      Result.andThen(changes => {
        const fieldsToNotifyAbout = notifyOnChangesToTheseFields[update.type];
        const shouldNotifyAboutChange = any(field => changes.includes(field), fieldsToNotifyAbout);
        if (shouldNotifyAboutChange) {
          this.notificationService.notify(update);
        }
        return Result.success(undefined);
      })
    );
  }

  getAllByType<T extends IdeaType>(type: T): IdeaTypeMap[T][] {
    return this.ideaRepository.all().filter(isIdeaOfType(type));
  }
}

const notifyOnChangesToTheseFields: { [K in IdeaType]: (keyof IdeaTypeMap[K])[] } = {
  [IdeaType.BasicIdea]: ["title"],
  [IdeaType.ToDo]: ["done"],
  [IdeaType.Concept]: ["references"],
}