namespace Api.Hubs;

public interface INotificationClient
{
    Task ReceiveNotification(string notification);
}