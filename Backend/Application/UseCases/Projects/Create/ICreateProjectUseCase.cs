using Communication.Requests;
using Communication.Responses;

namespace Application.UseCases.Projects.Create;

public interface ICreateProjectUseCase
{
    Task<ResponseProject> Execute(RequestProject request);
}