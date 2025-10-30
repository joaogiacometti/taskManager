using SharedKernel.ExceptionBase;
using SharedKernel.Resources;

namespace Domain.Entities;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<AppTask> Tasks { get; set; } = [];

    public void Validate()
    {
        var errorList = new List<string>();

        if (string.IsNullOrWhiteSpace(Name))
            errorList.Add(ResourceErrorMessages.NAME_REQUIRED);
        if (Name.Length > 200)
            errorList.Add(ResourceErrorMessages.NAME_MAX_LENGTH);
        if (Description is { Length: > 2000 })
            errorList.Add(ResourceErrorMessages.DESCRIPTION_MAX_LENGTH);

        if (errorList.Count != 0)
            throw new ErrorOnValidationException(errorList);
    }
}