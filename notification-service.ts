export interface NotificationService {
  notify(payload: unknown): Promise<void>;
}
