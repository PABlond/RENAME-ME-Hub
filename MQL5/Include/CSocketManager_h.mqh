#include <socket-library-mt4-mt5.mqh>

class CSocketManager
{
private:
    void ReconnectAttempt();
    void HandleServerData(string serverMessage);
    void MessagesToSend();
    void SendAccountData();
    void SendKeys();

protected:
    bool sendAccountData;
    ClientSocket *socket;
    string hostname;
    ushort port;
    string apiKey;
    string apiSecret;

public:
    void CSocketManager(const string _hostname,
                        const ushort _port,
                        const string _api_key,
                        const string _api_secret);
    void OnDeinit();
    void OnTick();
};

#include <CSocketManager_src.mqh>