using System.Net;

namespace SharedKernel.ExceptionBase;

public class NotFoundException(string message) : AppException(message)
{
    public override int StatusCode => HttpStatusCode.NotFound.GetHashCode();

    public override List<string> GetErrorList()
    {
        return [Message];
    }
}