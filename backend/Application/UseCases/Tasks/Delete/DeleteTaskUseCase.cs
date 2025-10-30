using Domain.Repositories;
using Domain.Repositories.Tasks;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Tasks.Delete;

public class DeleteTaskUseCase(
    ITaskWriteOnlyRepository taskWriteOnlyRepository,
    IUnitOfWork unitOfWork) : IDeleteTaskUseCase
{
    public async Task Execute(int id)
    {
        var entity = await taskWriteOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.TASK_NOT_FOUND);

        if (entity.Status == Domain.Enums.TaskStatus.InProgress)
            throw new ErrorOnValidationException([ResourceErrorMessages.TASK_IN_PROGRESS_CANNOT_BE_DELETED]);

        taskWriteOnlyRepository.Delete(entity);
        await unitOfWork.Commit();
    }
}