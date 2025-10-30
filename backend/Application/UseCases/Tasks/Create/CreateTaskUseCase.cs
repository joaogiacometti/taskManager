using Application.Mappings;
using Communication.Requests;
using Communication.Responses;
using Domain.Repositories;
using Domain.Repositories.Projects;
using Domain.Repositories.Tasks;
using Microsoft.AspNetCore.Identity;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Tasks.Create
{
    public class CreateTaskUseCase(
        ITaskWriteOnlyRepository taskWriteOnlyRepository,
        IProjectReadOnlyRepository projectReadOnlyRepository,
        IUnitOfWork unitOfWork,
        UserManager<IdentityUser> userManager) : ICreateTaskUseCase
    {
        public async Task<ResponseTask> Execute(RequestCreateTask request)
        {
            _ = await projectReadOnlyRepository.GetById(request.ProjectId)
               ?? throw new NotFoundException(ResourceErrorMessages.PROJECT_NOT_FOUND);

            if (!string.IsNullOrWhiteSpace(request.ResponsibleUserId))
                _ = await userManager.FindByIdAsync(request.ResponsibleUserId) ?? throw new NotFoundException(ResourceErrorMessages.RESPONSIBLE_NOT_FOUND);

            var entity = request.ToEntity();
            entity.Validate();

            await taskWriteOnlyRepository.Add(entity);
            await unitOfWork.Commit();

            return entity.ToResponse();
        }
    }
}