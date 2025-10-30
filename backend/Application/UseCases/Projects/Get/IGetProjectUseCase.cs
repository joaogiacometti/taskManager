using Communication.Responses;

namespace Application.UseCases.Projects.Get;

public interface IGetProjectUseCase
{
    Task<ResponseProject?> Execute(int id);
}