using Domain.Enums;
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
}