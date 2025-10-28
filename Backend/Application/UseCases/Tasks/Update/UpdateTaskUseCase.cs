using Application.Mappings;
using Communication.Requests;
using Domain.Repositories;
using Domain.Repositories.Tasks;
using Microsoft.AspNetCore.Identity;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Tasks.Update;

public class UpdateTaskUseCase(
    ITaskWriteOnlyRepository taskWriteOnlyRepository,
    IUnitOfWork unitOfWork,
    UserManager<IdentityUser> userManager) : IUpdateTaskUseCase
{
    public async Task Execute(int id, RequestUpdateTask request)
    {
        var entity = await taskWriteOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.TASK_NOT_FOUND);

        if (!string.IsNullOrWhiteSpace(request.ResponsibleUserId))
            _ = await userManager.FindByIdAsync(request.ResponsibleUserId)
                ?? throw new NotFoundException(ResourceErrorMessages.RESPONSIBLE_NOT_FOUND);

        entity.UpdateEntity(request);
        entity.Validate();

        await unitOfWork.Commit();
    }
}