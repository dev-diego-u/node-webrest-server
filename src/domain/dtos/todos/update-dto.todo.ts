export type UpdateTodoDtoResult =
  | { success: true; data: UpdateTodoDto }
  | { success: false; error: string };

export class UpdateTodoDto {
  private readonly text?: string;
  private readonly completedAt?: Date;

  constructor(text?: string, completedAt?: Date) {
    this.text = text;
    this.completedAt = completedAt;
  }

  static update(props: { [key: string]: any }): UpdateTodoDtoResult {
    const { text, completedAt } = props;
    // Validación de completedAt

    let completedAtDate = completedAt ? new Date(completedAt) : undefined;
    // console.log(completedAtDate);
    //if is not valid date
    if (completedAtDate && isNaN(completedAtDate.getTime())) {
      return { success: false, error: "CompletedAt must be a valid date" };
    }
    if (completedAt && !(completedAtDate instanceof Date)) {
      return { success: false, error: "CompletedAt must be a Date object" };
    }

    if (text && (typeof text !== "string" || text.trim().length === 0)) {
      return { success: false, error: "Text must be a non-empty string" };
    }
    console.log(text, completedAtDate);

    return {
      success: true,
      data: new UpdateTodoDto(text, completedAtDate),
    };
  }

  toObject() {
    return {
      text: this.text,
      completedAt: this.completedAt,
    };
  }
}
