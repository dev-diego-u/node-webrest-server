export type CreateTodoDtoResult =
  | { success: true; data: CreateTodoDto }
  | { success: false; error: string };

export class CreateTodoDto {
  private readonly text: string;
  private readonly completedAt?: Date;

  constructor(text: string, completedAt?: Date) {
    this.text = text;
    this.completedAt = completedAt;
  }

  static create(props: { [key: string]: any }): CreateTodoDtoResult {
    const { text, completedAt } = props;

    const completedAtDate = completedAt ? new Date(completedAt) : undefined;
    // console.log(completedAtDate);
    if (completedAtDate && isNaN(completedAtDate.getTime())) {
      return { success: false, error: "CompletedAt must be a valid date" };
    }
    if (completedAt && !(completedAtDate instanceof Date)) {
      return { success: false, error: "CompletedAt must be a Date object" };
    }
    if (typeof text !== "string" || text.trim().length === 0) {
      return { success: false, error: "Text must be a non-empty string" };
    }

    return {
      success: true,
      data: new CreateTodoDto(text, completedAtDate),
    };
  }

  toObject() {
    return {
      text: this.text,
      completedAt: this.completedAt,
    };
  }
}
