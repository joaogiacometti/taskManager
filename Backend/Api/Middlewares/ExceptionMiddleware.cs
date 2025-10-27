using System.Text.Json;
using Communication.Responses;
using SharedKernel.ExceptionBase;

namespace Api.Middlewares;

public class ExceptionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var statusCode = StatusCodes.Status500InternalServerError;
        var errorResponse = new ResponseError("Unknown Error");

        if (ex is AppException exception)
        {
            statusCode = exception.StatusCode;
            errorResponse = new ResponseError(exception.GetErrorList());
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var jsonResponse = JsonSerializer.Serialize(errorResponse);
        await context.Response.WriteAsync(jsonResponse);
    }
}