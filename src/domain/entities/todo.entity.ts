export class TodoEntity {
  constructor(
    public id: string,
    public text: string,
    public completedAt?: Date | null
  ) {}

  get isCompleted(): boolean {
    return !!this.completedAt;
  }

  public static fromObject(obj: { [key: string]: any }): TodoEntity {
    const { id, text, completedAt } = obj;
    //validate the properties if necessary
    if (!id) {
      throw new Error("ID is required");
    }
    if (!text) {
      throw new Error("Text is required");
    }
    let newCompletedAt;
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (isNaN(newCompletedAt.getTime())) {
        throw new Error("Invalid date format for completedAt");
      }
    }

    return new TodoEntity(id, text, completedAt);
  }
}
