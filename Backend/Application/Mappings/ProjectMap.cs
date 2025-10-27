using Communication.Requests;
using Communication.Responses;
using Domain.Entities;

namespace Application.Mappings;

public static class ProjectMap
{
    public static Project ToEntity(this RequestProject request)
    {
        return new Project
        {
            Name = request.Name,
            Description = request.Description,
        };
    }

    public static ResponseProject ToResponse(this Project entity)
    {
        return new ResponseProject(Id: entity.Id, Name: entity.Name, Description: entity.Description, CreatedAt: entity.CreatedAt);
    }

    public static List<ResponseProject> ToResponse(this List<Project> entities)
    {
        return entities.Select(ToResponse).ToList();
    }

    public static Project UpdateEntity(this Project entity, RequestProject request)
    {
        entity.Name = request.Name;
        entity.Description = request.Description;
        
        return entity;
    }
}