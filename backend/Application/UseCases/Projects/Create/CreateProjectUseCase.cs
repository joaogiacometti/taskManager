using Application.Mappings;
using Communication.Requests;
using Communication.Responses;
using Domain.Repositories;
using Domain.Repositories.Projects;

namespace Application.UseCases.Projects.Create;

public class CreateProjectUseCase(
    IProjectWriteOnlyRepository projectWriteOnlyRepository,
    IUnitOfWork unitOfWork) : ICreateProjectUseCase
{
    public async Task<ResponseProject> Execute(RequestProject request)
    {
        var entity = request.ToEntity();
        entity.Validate();

        await projectWriteOnlyRepository.Add(entity);
        await unitOfWork.Commit();
        
        return entity.ToResponse();
    }
}