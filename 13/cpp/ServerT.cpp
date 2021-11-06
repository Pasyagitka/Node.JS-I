#define _WINSOCK_DEPRECATED_NO_WARNINGS 
#define _CRT_SECURE_NO_WARNINGS
#include "Winsock2.h"				
#pragma comment(lib, "WS2_32.lib")
#include <iostream>
#include <Windows.h>
#include <string>
#include <Windows.h>

using namespace std;
string  GetErrorMsgText(int code);
string  SetErrorMsgText(string msgText, int code);

int main()
{
    SOCKET sS;
    WSADATA wsaData;					

	SOCKADDR_IN serv;                   
	serv.sin_family = AF_INET;         
	serv.sin_port = htons(2000);       
	serv.sin_addr.s_addr = inet_addr("127.0.0.1");  

	SOCKET cS;							
	SOCKADDR_IN clnt;					

	char ibuf[50];                      
	string obuf;						
	int  libuf = 0,                     
		 lobuf = 0;                      

    try
    {
        if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0)					throw  SetErrorMsgText("Startup:", WSAGetLastError());
        if ((sS = socket(AF_INET, SOCK_STREAM, NULL)) == INVALID_SOCKET)throw  SetErrorMsgText("socket:", WSAGetLastError());
		if (bind(sS, (LPSOCKADDR)&serv, sizeof(serv)) == SOCKET_ERROR)	throw  SetErrorMsgText("bind:", WSAGetLastError());
		if (listen(sS, SOMAXCONN) == SOCKET_ERROR)						throw  SetErrorMsgText("listen:", WSAGetLastError());

		memset(&clnt, 0, sizeof(clnt));
		int lclnt = sizeof(clnt);

		if ((cS = accept(sS, (sockaddr*)&clnt, &lclnt)) == INVALID_SOCKET) throw SetErrorMsgText("accept:", WSAGetLastError());
		if(recv(cS, ibuf, sizeof(ibuf), NULL) == SOCKET_ERROR) 	throw SetErrorMsgText("recv: ", WSAGetLastError());

		cout << endl << "recieved:" << ibuf << endl;

		string obuf = "ECHO:"; 
		obuf = obuf.append(ibuf);
		if ((lobuf = send(cS, obuf.c_str(), strlen(obuf.c_str()) + 1, NULL)) == SOCKET_ERROR)	throw SetErrorMsgText("send:", WSAGetLastError());
		if (closesocket(cS) == SOCKET_ERROR)   			throw SetErrorMsgText("closesocket:", WSAGetLastError());
		if (closesocket(sS) == SOCKET_ERROR)			throw SetErrorMsgText("closesocket:", WSAGetLastError());
		if (WSACleanup() == SOCKET_ERROR)				throw SetErrorMsgText("Cleanup:", WSAGetLastError());
	}
	catch (string errorMsgText)
	{
		cout << endl << "WSAGetLastError: " << errorMsgText;
	}
	return 0;
}

string  GetErrorMsgText(int code)
{
	string msgText;
	switch (code)
	{
	case WSAEINTR: msgText = "Function operation interrupted"; break;
	case WSAEACCES: msgText = "Permission denied"; break;
	case WSAEFAULT: msgText = "Wrong address"; break;
	case WSAEINVAL: msgText = "Error in argument"; break;
	case WSAEMFILE: msgText = "Too many files opened"; break;
	case WSAEWOULDBLOCK: msgText = "Resource temporarily unavailable"; break;
	case WSAEINPROGRESS: msgText = "Operation in progress"; break;
	case WSAEALREADY: msgText = "The operation is already in progress"; break;
	case WSAENOTSOCK: msgText = "Socket is set incorrectly"; break;
	case WSAEDESTADDRREQ: msgText = "Location address required"; break;
	case WSAEMSGSIZE: msgText = "Message is too long"; break;
	case WSAEPROTOTYPE: msgText = "Wrong protocol type for socket"; break;
	case WSAENOPROTOOPT: msgText = "Error in protocol option"; break;
	case WSAEPROTONOSUPPORT: msgText = "The protocol is not supported"; break;
	case WSAESOCKTNOSUPPORT: msgText = "Socket type is not supported"; break;
	case WSAEOPNOTSUPP: msgText = "Operation is not supported"; break;
	case WSAEPFNOSUPPORT: msgText = "Protocol type is not supported"; break;
	case WSAEAFNOSUPPORT: msgText = "The address type is not supported by the protocol"; break;
	case WSAEADDRINUSE: msgText = "The address is already in use"; break;
	case WSAEADDRNOTAVAIL: msgText = "The requested address cannot be used"; break;
	case WSAENETDOWN: msgText = "Network disconnected"; break;
	case WSAENETUNREACH: msgText = "Network not reachable"; break;
	case WSAENETRESET: msgText = "The network broke the connection"; break;
	case WSAECONNABORTED: msgText = "Programmatic communication failure"; break;
	case WSAECONNRESET: msgText = "Connection not restored"; break;
	case WSAENOBUFS: msgText = "Not enough memory for buffers"; break;
	case WSAEISCONN: msgText = "The socket is already connected"; break;
	case WSAENOTCONN: msgText = "Socket is not connected"; break;
	case WSAESHUTDOWN: msgText = "Cannot execute send: socket has terminated"; break;
	case WSAETIMEDOUT: msgText = "The allotted time interval has ended"; break;
	case WSAECONNREFUSED: msgText = "Connection rejected"; break;
	case WSAEHOSTDOWN: msgText = "The host is in an inoperable state"; break;
	case WSAEHOSTUNREACH: msgText = "No route for the host"; break;
	case WSAEPROCLIM: msgText = "Too many processes"; break;
	case WSASYSNOTREADY: msgText = "Network is not available"; break;
	case WSAVERNOTSUPPORTED: msgText = "This version is not available"; break;
	case WSANOTINITIALISED: msgText = "Initialization failed WS2_32.dll"; break;
	case WSAEDISCON: msgText = "Shutdown is in progress"; break;
	case WSATYPE_NOT_FOUND: msgText = "Class not found"; break;
	case WSAHOST_NOT_FOUND: msgText = "Host not found"; break;
	case WSATRY_AGAIN: msgText = "Unauthorized host not found"; break;
	case WSANO_RECOVERY: msgText = "Undefined error"; break;
	case WSANO_DATA: msgText = "No record of the requested type"; break;
	case WSA_INVALID_HANDLE: msgText = "Specified error event descriptor"; break;
	case WSA_INVALID_PARAMETER: msgText = "One or more parameters with an error"; break;
	case WSA_IO_INCOMPLETE: msgText = "The I / O object is not in the signal state"; break;
	case WSA_IO_PENDING: msgText = "The operation will be completed later"; break;
	case WSA_NOT_ENOUGH_MEMORY: msgText = "Not enough memory"; break;
	case WSA_OPERATION_ABORTED: msgText = "Operation rejected"; break;
	case WSASYSCALLFAILURE: msgText = "System call crash"; break;
	default: msgText = "***ERROR***"; break;
	}

	return msgText;
};
string  SetErrorMsgText(string msgText, int code)
{
	return  msgText + GetErrorMsgText(code);
};

