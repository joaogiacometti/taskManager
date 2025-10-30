using Communication.Enums;

namespace Communication.Responses;

public record ResponseTask(
    int Id,
    string Title,
    string? Description,
    Enums.TaskStatus Status,
    TaskPriority Priority,
    int ProjectId,
    string? ResponsibleUserId,
    DateTime CreatedAt,
    DateTime? Deadline,
    DateTime? FinishedAt
);