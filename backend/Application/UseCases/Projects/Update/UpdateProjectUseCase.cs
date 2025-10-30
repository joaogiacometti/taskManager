using Application.Mappings;
using Communication.Requests;
using Domain.Repositories;
using Domain.Repositories.Projects;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Projects.Update;

public class UpdateProjectUseCase(
    IProjectWriteOnlyRepository projectWriteOnlyRepository,
    IUnitOfWork unitOfWork) : IUpdateProjectUseCase
{
    public async Task Execute(int id, RequestProject request)
    {
        var entity = await projectWriteOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.PROJECT_NOT_FOUND);

        entity.UpdateEntity(request);
        entity.Validate();

        await unitOfWork.Commit();
    }
}