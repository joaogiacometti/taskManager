using Communication.Requests;

namespace Application.UseCases.Tasks.UpdateStatus;

public interface IUpdateTaskStatusUseCase
{
    Task Execute(int id, RequestUpdateTaskStatus request);
}
