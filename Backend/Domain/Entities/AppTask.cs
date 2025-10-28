using Domain.Enums;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;
using TaskStatus = Domain.Enums.TaskStatus;

namespace Domain.Entities;

public class AppTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public TaskStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public int ProjectId { get; set; }
    public string? ResponsibleUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? Deadline { get; set; }
    public DateTime? FinishedAt { get; set; }

    public Project Project { get; set; } = null!;

    public void Validate()
    {
        var errorList = new List<string>();

        if (string.IsNullOrWhiteSpace(Title))
            errorList.Add(ResourceErrorMessages.TITLE_REQUIRED);

        if (Title.Length > 200)
            errorList.Add(ResourceErrorMessages.TITLE_MAX_LENGTH);

        if (Description is { Length: > 2000 })
            errorList.Add(ResourceErrorMessages.DESCRIPTION_MAX_LENGTH);

        if (!Enum.IsDefined(Status))
            errorList.Add(ResourceErrorMessages.STATUS_INVALID);

        if (!Enum.IsDefined(Priority))
            errorList.Add(ResourceErrorMessages.PRIORITY_INVALID);

        if (Deadline.HasValue && Deadline.Value < DateTime.UtcNow)
            errorList.Add(ResourceErrorMessages.DEADLINE_PAST);

        if (errorList.Count != 0)
            throw new ErrorOnValidationException(errorList);
    }
}