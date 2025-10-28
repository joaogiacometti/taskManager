using Application.Mappings;
using Communication.Responses;
using Domain.Repositories.Tasks;

namespace Application.UseCases.Tasks.GetAll;

public class GetTasksUseCase(ITaskReadOnlyRepository taskReadOnlyRepository) : IGetTasksUseCase
{
    public async Task<List<ResponseTask>> Execute()
    {
        var entities = await taskReadOnlyRepository.GetAll();
        return entities.ToResponse();
    }
}