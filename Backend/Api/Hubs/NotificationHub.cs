using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class NotificationHub : Hub<INotificationClient>
{
    public async Task SendNotification(string notification)
    {
        await Clients.All.ReceiveNotification(notification);
    }
}

