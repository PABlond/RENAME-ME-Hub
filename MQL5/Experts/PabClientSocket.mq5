#property strict

#include <CSocketManager_h.mqh>

input string API_KEY;
input string API_SECRET;

string Hostname = "127.0.0.1";
ushort ServerPort = 5555;

CSocketManager *main = new CSocketManager(Hostname, ServerPort, API_KEY, API_SECRET);

void OnInit()
{
    main.OnTick();
}

void OnDeinit(const int reason)
{
    main.OnDeinit();
}

void OnTick()
{
    main.OnTick();
}