using Communication.Requests;
using Domain.Repositories;
using Domain.Repositories.Tasks;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Tasks.UpdateStatus;

public class UpdateTaskStatusUseCase(
    ITaskWriteOnlyRepository taskWriteOnlyRepository,
    IUnitOfWork unitOfWork) : IUpdateTaskStatusUseCase
{
    public async Task Execute(int id, RequestUpdateTaskStatus request)
    {
        var entity = await taskWriteOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.TASK_NOT_FOUND);

        var newStatus = (Domain.Enums.TaskStatus)request.Status;
        
        ValidateStatusTransition(entity.Status, newStatus);

        entity.Status = newStatus;

        if(entity.Status == Domain.Enums.TaskStatus.Completed)
            entity.FinishedAt = DateTime.UtcNow;

        await unitOfWork.Commit();
    }

    private static void ValidateStatusTransition(Domain.Enums.TaskStatus currentStatus, Domain.Enums.TaskStatus newStatus)
    {
        if (currentStatus == newStatus)
            return;

        var isValidTransition = (currentStatus, newStatus) switch
        {
            (Domain.Enums.TaskStatus.Pending, Domain.Enums.TaskStatus.InProgress) => true,
            (Domain.Enums.TaskStatus.InProgress, Domain.Enums.TaskStatus.Completed) => true,
            _ => false
        };

        if (!isValidTransition)
            throw new ErrorOnValidationException([ResourceErrorMessages.STATUS_TRANSITION_INVALID]);
    }
}
