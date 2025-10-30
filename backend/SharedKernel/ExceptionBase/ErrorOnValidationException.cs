using System.Net;

namespace SharedKernel.ExceptionBase;

public class ErrorOnValidationException(List<string> errorList) : AppException(string.Empty)
{
    public override int StatusCode => HttpStatusCode.BadRequest.GetHashCode();

    public override List<string> GetErrorList()
    {
        return errorList;
    }
}