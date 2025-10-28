using Communication.Enums;

namespace Communication.Requests;

public record RequestCreateTask(
    string Title,
    string? Description,
    Enums.TaskStatus Status,
    TaskPriority Priority,
    int ProjectId,
    string? ResponsibleUserId,
    DateTime? Deadline
);

public record RequestUpdateTask(
    string Title,
    string? Description,
    TaskPriority Priority,
    string? ResponsibleUserId,
    DateTime? Deadline
);

public record RequestUpdateTaskStatus(
    Enums.TaskStatus Status
);