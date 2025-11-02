using Communication.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Api.Endpoints;

public static class UserEndpoints
{
    public static void AddUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/usuarios")
            .WithTags("Usuários")
            .RequireAuthorization();

        group.MapGet("", async ([FromServices] UserManager<IdentityUser> userManager, [FromServices] ILogger logger) =>
        {
            var users = await userManager.Users
                .Select(u => new ResponseUser
                {
                    Id = u.Id,
                    UserName = u.UserName
                })
                .ToListAsync();

            logger.LogInformation("Returned {Count} users", users.Count);

            return users.Count == 0 ? Results.NoContent() : Results.Ok(users);
        })
        .Produces<List<ResponseUser>>()
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
