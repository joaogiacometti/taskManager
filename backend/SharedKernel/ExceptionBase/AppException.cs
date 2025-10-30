namespace SharedKernel.ExceptionBase;

public abstract class AppException(string message) : SystemException(message)
{
    public abstract int StatusCode { get; }
    public abstract List<string> GetErrorList();
}