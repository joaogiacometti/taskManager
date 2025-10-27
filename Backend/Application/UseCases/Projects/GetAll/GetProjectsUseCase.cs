using Application.Mappings;
using Communication.Responses;
using Domain.Repositories.Projects;

namespace Application.UseCases.Projects.GetAll;

public class GetProjectsUseCase(IProjectReadOnlyRepository projectReadOnlyRepository) : IGetProjectsUseCase
{
    public async Task<List<ResponseProject>> Execute()
    {
        var entities = await projectReadOnlyRepository.GetAll();

        return entities.ToResponse();
    }
}