using Communication.Requests;
using Communication.Responses;

namespace Application.UseCases.Tasks.Create;

public interface ICreateTaskUseCase
{
    Task<ResponseTask> Execute(RequestCreateTask request);
}