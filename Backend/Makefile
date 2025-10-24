API = ./Api/Api.csproj
INFRA = ./Infra/Infra.csproj

add-migration:
	dotnet ef migrations add $(name) -s $(API) -p $(INFRA)

remove-migration:
	dotnet ef migrations remove -s $(API) -p $(INFRA)

update-database:
	dotnet ef database update -s $(API) -p $(INFRA)