using Communication.Responses;

namespace Application.UseCases.Projects.GetAll;

public interface IGetProjectsUseCase
{
    Task<List<ResponseProject>> Execute();
}