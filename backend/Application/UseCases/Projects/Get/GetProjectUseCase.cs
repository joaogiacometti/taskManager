using Application.Mappings;
using Communication.Responses;
using Domain.Repositories.Projects;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Projects.Get;

public class GetProjectUseCase(IProjectReadOnlyRepository projectReadOnlyRepository) : IGetProjectUseCase
{
    public async Task<ResponseProject?> Execute(int id)
    {
        var entity = await projectReadOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.PROJECT_NOT_FOUND);

        return entity.ToResponse();
    }
}