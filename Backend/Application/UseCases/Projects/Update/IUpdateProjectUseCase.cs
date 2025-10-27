using Communication.Requests;

namespace Application.UseCases.Projects.Update;

public interface IUpdateProjectUseCase
{
    Task Execute(int id, RequestProject request);
}