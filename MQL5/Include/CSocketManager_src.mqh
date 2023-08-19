#include <JAson.mqh>
#include <CSocketManager_h.mqh>

void CSocketManager::CSocketManager(const string _hostname,
                                    const ushort _port,
                                    const string _api_key,
                                    const string _api_secret)
{
    sendAccountData = false;
    socket = NULL;
    hostname = _hostname;
    port = _port;
    apiKey = _api_key;
    apiSecret = _api_secret;
}

void CSocketManager::OnTick()
{
    if (!socket)
        ReconnectAttempt();

    if (socket.IsSocketConnected())
        HandleServerData(socket.Receive());

    // MessagesToSend();
}

void CSocketManager::ReconnectAttempt()
{
    socket = new ClientSocket(hostname, port);
    if (socket.IsSocketConnected())
    {
        Print("Client connection succeeded");
        SendKeys();
    }

    else
    {
        Print("Client disconnected. Will retry.");
        delete socket;
        socket = NULL;
    }
}

void CSocketManager::HandleServerData(string serverMessage)
{
    if (serverMessage == "account:data")
        sendAccountData = true;
}

void CSocketManager::SendAccountData()
{
    CJAVal data;
    data["equity"] = AccountInfoDouble(ACCOUNT_EQUITY);
    data["balance"] = AccountInfoDouble(ACCOUNT_BALANCE);

    socket.Send(data.Serialize());
}

void CSocketManager::SendKeys()
{
    CJAVal data;
    data["info"] = "infokeys";
    data["API_KEY"] = apiKey;
    data["API_SECRET"] = apiSecret;

    socket.Send(data.Serialize());
}

void CSocketManager::MessagesToSend()
{
    if (sendAccountData)
        SendAccountData();
}

void CSocketManager::OnDeinit()
{
    if (socket)
    {
        delete socket;
        socket = NULL;
    }
}