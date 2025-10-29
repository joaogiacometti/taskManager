using Api.Endpoints;
using Api.Middlewares;
using Application;
using Infra;
using Infra.DataAccess;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

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

app.UseMiddleware<ExceptionMiddleware>();

app.MapIdentityApi<IdentityUser>();

await app.RunAsync();
