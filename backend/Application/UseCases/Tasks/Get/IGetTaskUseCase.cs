using Communication.Responses;

namespace Application.UseCases.Tasks.Get;

public interface IGetTaskUseCase
{
    Task<ResponseTask?> Execute(int id);
}