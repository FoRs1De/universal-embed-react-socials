type TimerHandle = ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;

export class Subs {
  private timers: TimerHandle[] = [];

  setInterval(callback: () => void, ms: number): ReturnType<typeof setInterval> {
    const id = setInterval(callback, ms);
    this.timers.push(id);
    return id;
  }

  setTimeout(callback: () => void, ms: number): ReturnType<typeof setTimeout> {
    const id = setTimeout(callback, ms);
    this.timers.push(id);
    return id;
  }

  createCleanup(): () => void {
    return () => {
      this.timers.forEach((id) => {
        clearInterval(id as ReturnType<typeof setInterval>);
        clearTimeout(id as ReturnType<typeof setTimeout>);
      });
      this.timers = [];
    };
  }
}
