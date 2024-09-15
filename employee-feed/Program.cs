using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddAzureClients(builder =>
        {
            builder.AddServiceBusClient(Environment.GetEnvironmentVariable("SERVICEBUSCONNSTR_ServiceBusConnectionString"));
        });
    })
    .Build();

host.Run();
