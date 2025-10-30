using Api.Endpoints;
using Api.Hubs;
using Api.Middlewares;
using Application;
using Infra;
using Infra.DataAccess;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

builder.Services.AddCors();

builder.Services.AddInfra(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddAuthorization();

builder.Services
    .AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

app.AddProjectEndpoints();
app.AddTaskEndpoints();
app.AddDashboardEndpoints();

if (app.Environment.IsDevelopment())
{
    app.Services.MigrateDatabase();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseMiddleware<ExceptionMiddleware>();

app.MapGroup("/api")
    .MapIdentityApi<IdentityUser>();

app.MapHub<NotificationHub>("/api/hubs/notification");

await app.RunAsync();
