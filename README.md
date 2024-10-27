# Revit Web App Boilerplate
Boilerplate .NET solution for Revit Web Apps. Built using Revit Plugin wizard for Revit 2022.

## Requirements
- Visual Studio Express 2017 or later

## Dependencies
- Microsoft.Web.WebView2 < v1.0.1938.49
- Newtonsoft.Json
- System.Text.Json

## References
- PresentationCore
- PresentationFramework
- System.Drawing
- System.Xaml
- RevitAPI
- RevitAPIUI


## Important
1. Change your `.addin` to your solution name, ensuring that it refers to the DLL like `<solution_name>/<solution_name>.dll`

2. Change the Post Build script to the following (change the Revit version according to your version):
```cmd
if exist "$(AppData)\Autodesk\REVIT\Addins\2022" ^
copy "$(ProjectDir)*.addin" "$(AppData)\Autodesk\REVIT\Addins\2022"

SET outpath=$(ProjectDir)$(OutputPath)
SET outpath=%outpath:~0,-1%
SET pagepath=$(ProjectDir)\ui
SET solution_name=YourAppName

rem copy the WebView2 runtime
copy $(ProjectDir)$(OutputPath)\runtimes\win-x64\native\*.dll $(ProjectDir)$(OutputPath)
rmdir $(ProjectDir)$(OutputPath)\runtimes /s /q
rmdir $(ProjectDir)$(OutputPath)\Win32
rmdir $(ProjectDir)$(OutputPath)\Win64

if exist "$(AppData)\Autodesk\REVIT\Addins\2022" ^
xcopy %outpath% $(AppData)\Autodesk\REVIT\Addins\2022\%solution_name% /c /i /e /h /y


if exist "$(AppData)\Autodesk\REVIT\Addins\2022" ^
xcopy %pagepath% $(AppData)\Autodesk\REVIT\Addins\2022\%solution_name%\ui /c /i /e /h /y

rem echo %outpath% (for checking)
```

3. Change the contents of `ui` to your built web app. The contents of this will be hidden in your assembly to prevent tampering.

4. Instead of loading the ui from a local file, you may replace `WebViewer.LaunchWeb.cs:88` with a url of your development server, to allow faster development (just refresh to show changes to the ui). For this example, we just run a simple http python server from the `ui` folder by using the command `python -m http.server`. 


# How it works
1. Revit opens up a WebView2 window
2. We send a message to WebView2 from the web application ( [index.js:12](https://github.com/boblyx/blr-revitwebapp/blob/a73f9236696bc764e67b8d22bef41f61b03e69d1/RevitWebApp/ui/index.js#L12) ) using:
```js
const payload = {"action": "Test", "payload": {"msg": "my msg"}};
w.chrome?.webview?.postMessage(payload);
```
3. This payload can then be deserialized on the addin side via [WebWindow.xaml.cs:49](https://github.com/boblyx/blr-revitwebapp/blob/a73f9236696bc764e67b8d22bef41f61b03e69d1/RevitWebApp/WebViewer/WebWindow.xaml.cs#L49).
4. And used to call various Revit functions using Revit's [UIApplication](https://www.revitapidocs.com/2017/51ca80e2-3e5f-7dd2-9d95-f210950c72ae.htm) instance via [RevitEventHandler.cs:44](https://github.com/boblyx/blr-revitwebapp/blob/a73f9236696bc764e67b8d22bef41f61b03e69d1/RevitWebApp/RevitEventHandler.cs#L44).
