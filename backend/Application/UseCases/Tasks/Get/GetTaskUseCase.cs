using Application.Mappings;
using Communication.Responses;
using Domain.Repositories.Tasks;
using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Application.UseCases.Tasks.Get;

public class GetTaskUseCase(ITaskReadOnlyRepository taskReadOnlyRepository) : IGetTaskUseCase
{
    public async Task<ResponseTask?> Execute(int id)
    {
        var entity = await taskReadOnlyRepository.GetById(id)
            ?? throw new NotFoundException(ResourceErrorMessages.TASK_NOT_FOUND);

        return entity.ToResponse();
    }
}