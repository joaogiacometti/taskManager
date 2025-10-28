namespace Application.UseCases.Tasks.Delete;

public interface IDeleteTaskUseCase
{
    Task Execute(int id);
}