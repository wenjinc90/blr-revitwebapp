using System.Collections.Generic;
using System.Diagnostics;
using Autodesk.Revit.UI;
using Autodesk.Revit.DB;
using Autodesk.Revit.DB.Architecture;
using System;

/// <summary>
/// For executing Revit Routines when called from Web UI
/// Author: Bob Lee
/// </summary>
namespace RevitWebApp
{
    public class RevitEventHandler : IExternalEventHandler
    {
        public enum RevitActionsEnum
        {
            Invalid = -1,
            Test,
            GetVersion
        }

        private RevitActionsEnum _currentRevitActions;
        private readonly ExternalEvent _externalEvent;
        public WebWindow webWindow;

        public RevitEventHandler()
        {
            _externalEvent = ExternalEvent.Create(this);
        }

        public void Execute(UIApplication app)
        {
            Debug.WriteLine("Handling Revit Event!");
            switch (_currentRevitActions)
            {
                case RevitActionsEnum.Test:
                    Debug.WriteLine("Msg received");
                    // To send data back to the Web ui:
                    webWindow.SendPayload("Test", "{\"msg\": \"msg from Revit!\"}");
                    break;
                case RevitActionsEnum.GetVersion:
                    Debug.WriteLine("Getting version...");
                    var ver_num = app.Application.VersionNumber;
                    webWindow.SendPayload("GetVersion", "{\"version\":"+ver_num+"}");
               
                    break;
                default:
                    Debug.WriteLine("Unhandled Action.");
                    break;
            }
        }

        public ExternalEventRequest Raise(RevitActionsEnum revitActionsName) {
            _currentRevitActions = revitActionsName;
            return _externalEvent.Raise();
        }

        public string GetName()
        {
            return nameof(RevitEventHandler);
        }

        
    }
}
