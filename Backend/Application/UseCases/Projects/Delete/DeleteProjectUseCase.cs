using Domain.Repositories;
using Domain.Repositories.Projects;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Projects.Delete;

public class DeleteProjectUseCase(
    IProjectWriteOnlyRepository projectWriteOnlyRepository,
    IUnitOfWork unitOfWork) : IDeleteProjectUseCase
{
    public async Task Execute(int id)
    {
        var entity = await projectWriteOnlyRepository.GetById(id)
                ?? throw new NotFoundException(ResourceErrorMessages.PROJECT_NOT_FOUND);
        
        projectWriteOnlyRepository.Delete(entity);

        await unitOfWork.Commit();
    }
}