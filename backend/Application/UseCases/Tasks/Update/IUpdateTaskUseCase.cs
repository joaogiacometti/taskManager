using Communication.Requests;

namespace Application.UseCases.Tasks.Update;

public interface IUpdateTaskUseCase
{
    Task Execute(int id, RequestUpdateTask request);
}