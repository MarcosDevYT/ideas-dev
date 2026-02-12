type EventHandler = (data?: unknown) => void;

class EventBus {
  private events: { [key: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event: string, handler: EventHandler) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((h) => h !== handler);
  }

  emit(event: string, data?: unknown) {
    if (!this.events[event]) return;
    this.events[event].forEach((handler) => handler(data));
  }
}

export const eventBus = new EventBus();

export const EVENTS = {
  REFRESH_SIDEBAR: "REFRESH_SIDEBAR",
};
