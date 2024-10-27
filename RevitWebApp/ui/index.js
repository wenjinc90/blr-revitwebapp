/**
  * index.js
  * @author Bob Lee
  */

// ACTION 1: Send and get a test message
function sendTestMsg(){
  console.log("Sending test message!"); 
  const wv2msg = {"action": "Test", "payload": {"msg": "hello world"}};
  try{
    const w = window;
    w.chrome?.webview?.postMessage(wv2msg);
  }catch(err){
    console.error(err);
  }
}

function showTestReply(e){
  console.log(e);
  const msg = e.detail.msg;
  const answer = document.querySelector("#test-res");
  answer.value = msg
}
// END ACTION 1

// ACTION 2: get info from Revit
function getRevitVersion(){
  console.log("Getting Revit version!");
  console.log("Sending test message!"); 
  const wv2msg = {"action": "GetVersion", "payload": {"msg": "give me my version!"}};
  try{
    const w = window;
    w.chrome?.webview?.postMessage(wv2msg);
  }catch(err){
    console.error(err);
  }
}

function showRevitVersion(e){
  console.log(e);
  const ver = e.detail.version
  const answer = document.querySelector("#ver-res");
  answer.value = ver;
}
// END ACTION 2

/**
  * Initialize listeners to listen for CustomEvent dispatched from Revit addin.
  */
function initRevitListeners(){
  document.addEventListener("GetVersion", showRevitVersion);
  document.addEventListener("Test", showTestReply);
}

/**
  * Initializes Web UI
  */
function init(){
  const root = document.querySelector("#root")
  
  const action_map = {
    
    "send-msg": sendTestMsg,
    "check-revit-version": getRevitVersion

  }

  root.innerHTML = `
    <div style="padding:20px;">
      <h1 style="margin-bottom:1em;">My Revit Web App</h1>
      <div id="actions" class = "d-flex flex-column">
        <div class = "m-4">
          <button id = "send-msg" class="action_btn btn btn-primary mb-2">Send a Message To Revit</button>
          <div class="m-2">
          Reply from Revit: <input id="test-res" class = "ms-4" type="text"></input>
          </div>
        </div>
        <div class = "m-4">
          <button id = "check-revit-version" class="action_btn btn btn-primary mb-2">Get Revit Version</button>
          <div class="m-2">
          Revit Version: <input id="ver-res" class = "ms-4" type="text"></input>
          </div>
        </div>
      </div>
    </div>
  `

  const actions_div = root.querySelector("#actions");
  for (const d of actions_div.querySelectorAll(".action_btn")){
    /** @type {HTMLButtonElement}*/
    const btn = d
    const id = d.id;
    
    if (!(id in action_map)){ continue; }
    btn.onclick = () => {
      action_map[id]();
    } 
  }
  initRevitListeners();
}

// MAIN

init();
