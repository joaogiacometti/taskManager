namespace Application.UseCases.Projects.Delete;

public interface IDeleteProjectUseCase
{
    Task Execute(int id);
}