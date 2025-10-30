using Communication.Requests;
using Communication.Responses;
using Domain.Entities;

namespace Application.Mappings;

public static class TaskMap
{
    public static AppTask ToEntity(this RequestCreateTask request)
    {
        return new AppTask
        {
            Title = request.Title,
            Description = request.Description,
            Status = (Domain.Enums.TaskStatus)request.Status,
            Priority = (Domain.Enums.TaskPriority)request.Priority,
            ProjectId = request.ProjectId,
            ResponsibleUserId = request.ResponsibleUserId,
            Deadline = request.Deadline
        };
    }

    public static ResponseTask ToResponse(this AppTask entity)
    {
        return new ResponseTask(
            Id: entity.Id,
            Title: entity.Title,
            Description: entity.Description,
            Status: (Communication.Enums.TaskStatus)entity.Status,
            Priority: (Communication.Enums.TaskPriority)entity.Priority,
            ProjectId: entity.ProjectId,
            ResponsibleUserId: entity.ResponsibleUserId,
            CreatedAt: entity.CreatedAt,
            Deadline: entity.Deadline,
            FinishedAt: entity.FinishedAt
        );
    }

    public static List<ResponseTask> ToResponse(this List<AppTask> entities)
    {
        return [.. entities.Select(ToResponse)];
    }

    public static AppTask UpdateEntity(this AppTask entity, RequestUpdateTask request)
    {
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.Priority = (Domain.Enums.TaskPriority)request.Priority;
        entity.ResponsibleUserId = request.ResponsibleUserId;
        entity.Deadline = request.Deadline;

        return entity;
    }
}