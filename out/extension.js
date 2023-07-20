"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const nodeDependencies_1 = require("./nodeDependencies");
const jsonOutline_1 = require("./jsonOutline");
const ftpExplorer_1 = require("./ftpExplorer");
const fileExplorer_1 = require("./fileExplorer");
const testViewDragAndDrop_1 = require("./testViewDragAndDrop");
const testView_1 = require("./testView");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("codeGraph.start", () => {
        // Create and show panel
        const panel = vscode.window.createWebviewPanel("Code Graph", "Code Graph", vscode.ViewColumn.One, {
            enableScripts: true,
        });
        panel.webview.html = getWebviewContent();
    }));
    const rootPath = vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    // Samples of `window.registerTreeDataProvider`
    const nodeDependenciesProvider = new nodeDependencies_1.DepNodeProvider(rootPath);
    vscode.window.registerTreeDataProvider("nodeDependencies", nodeDependenciesProvider);
    vscode.commands.registerCommand("nodeDependencies.refreshEntry", () => nodeDependenciesProvider.refresh());
    vscode.commands.registerCommand("extension.openPackageOnNpm", (moduleName) => vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
    vscode.commands.registerCommand("nodeDependencies.addEntry", () => vscode.window.showInformationMessage(`Successfully called add entry.`));
    vscode.commands.registerCommand("nodeDependencies.editEntry", (node) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
    vscode.commands.registerCommand("nodeDependencies.deleteEntry", (node) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
    const jsonOutlineProvider = new jsonOutline_1.JsonOutlineProvider(context);
    vscode.window.registerTreeDataProvider("jsonOutline", jsonOutlineProvider);
    vscode.commands.registerCommand("jsonOutline.refresh", () => jsonOutlineProvider.refresh());
    vscode.commands.registerCommand("jsonOutline.refreshNode", (offset) => jsonOutlineProvider.refresh(offset));
    vscode.commands.registerCommand("jsonOutline.renameNode", (args) => {
        let offset = undefined;
        if (args.selectedTreeItems && args.selectedTreeItems.length) {
            offset = args.selectedTreeItems[0];
        }
        else if (typeof args === "number") {
            offset = args;
        }
        if (offset) {
            jsonOutlineProvider.rename(offset);
        }
    });
    vscode.commands.registerCommand("extension.openJsonSelection", (range) => jsonOutlineProvider.select(range));
    // Samples of `window.createView`
    new ftpExplorer_1.FtpExplorer(context);
    new fileExplorer_1.FileExplorer(context);
    // Test View
    new testView_1.TestView(context);
    // Drag and Drop proposed API sample
    // This check is for older versions of VS Code that don't have the most up-to-date tree drag and drop API proposal.
    if (typeof vscode.DataTransferItem === "function") {
        new testViewDragAndDrop_1.TestViewDragAndDrop(context);
    }
}
exports.activate = activate;
function getCssStyle() {
    return `
    <style>
    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      padding-top: 100px; /* Location of the box */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
    }

    .modal-content {
      background-color: #fefefe;
      margin: auto;
      padding: 20px;
      border: 1px solid #fefefe;
      border-radius: 10px;
      min-width:500px;
      width: 30%;
    }

    .close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    .hidded-button{
      display: none !important;;
    }

    .button.filter-button{
      margin: 0px 10px 10px 0px;
    }
    .button-tools{
      display: flex;
      flex-flow: row nowrap;
      margin: 0px 10px;
    }
    .button-controls{
      width: 55%;
    }
    .buttons-container{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    .buttons-section{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .button-filters{
      width: 100%;
    }

    .card-controls.button-filters{
      margin-left:15px;
    }
    .button {
      background-color: #DCE5DF;
      border:3px solid #DCE5DF;
      max-height: 30px !important;
      border-radius: 10px;
      color: #122D42;
      padding: 0px 10px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      white-space: nowrap;
      cursor: pointer;
      width: fit-content;
      transition-duration: 0.4s;
    }

    .button:hover {
      color: #122D42 !important;
      transform:scale(1.05,1.05);
      border-color: #E1BC29;
      background-color: #E1BC29;
    }
    .spinner-center{
      display: flex;
      justify-content: center;
      align-content: center;
      height: 75%;
      flex-direction: column;
      flex-wrap: wrap;  
      text-align:center;
      color:black;      
    }
    #task-text{
      margin-top: 0px;
      font-size: 17px;
      margin-bottom:25px;
    }

    h1{
      margin-bottom:5px;
      margin-top:2.5px;
    }

    .modal-content h2{
      color:black;
      margin-bottom:30px;
      margin-top:2.5px;
    }
    .image-button{
      min-height:100px;
      min-width:100px;
      display: flex;
      flex-flow: column nowrap;
    
      text-align: center;
      align-items: center;
      justify-content: center;
      padding: 10px 5px 0px 5px;
    }
    .image-button > p{
      margin-bottom: 0px;
    }

    .composed-button{
      display: flex;
      flex-flow: row nowrap;
      text-align: center;
      align-items: center;
    }

    .composed-button.composed-button-big  {
      padding: 0px 20px;
      margin: 0px 10px 2.5px 0px;
    }

    .icon-button.composed-button-big {
      padding: 5px 20px;
    }

    .filter-circle{
      width: 15px;
      height: 15px;
      margin: 5px;
      border-radius: 50px;
      border:1px solid grey
    }
    p.filter-name {
      padding-bottom:3px;
      padding-right:5px;
    }
    p.icon-text {
      padding-right:5px;
    }
    .rotation-container{
    }
    .task-area{
      color: #122D42;
      padding: 10px;
      background-color: white;
      border-radius: 10px;
      margin-bottom: 15px;
    }

    .loader {
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid #E15554;
      width: 60px;
      height: 60px;
      -webkit-animation: spin 2s linear infinite; /* Safari */
      animation: spin 2s linear infinite;
    }
      
    @-webkit-keyframes spin {
      0% { -webkit-transform: rotate(0deg); }
      100% { -webkit-transform: rotate(360deg); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .task-container{
      margin:10px;
    }
    .build-header{
      margin-left:10px;
    }
    .button-container{
      width:100%;
      height: 100%;
    }
    #confirmation-msg{
      color: black;
      background-color: #white; 
    }

    #experiment-finished-msg{
      padding: 5px 20px 20px 20px;
      margin: 10px;
      color: white;
      background-color: #3BB273; 
      border-radius: 10px;
    }
    #experiment-finished-msg h1{
      padding-bottom: 20px;
    }

    .button.yes-button{
      color: #DCE5DF;
      background-color: #3BB273;
      border-color: #3BB273;
    }

    .button.yes-button:hover{
      color: #DCE5DF !important;
    }

    .button.no-button {
      color: #DCE5DF;
      background-color: #E15554 !important;
      border-color: #E15554;
    }

    .button.no-button:hover{
      color: #DCE5DF !important;
    }
    .card-controls{
      padding:10px;
      margin: 10px 0px;
      border-radius: 10px;
      background-color:white;
    }
    h2.cart-title{
      color: #122D42;
      margin: 0px 0px 15px 0px;
    }
    .card-subtitle{
      margin: 0px;
      color: #122D42;
    }
    .card-controls span.material-icons{
      color: #E15554 !important;
    }

    .card-controls span.material-icons{
      color: #E15554 !important;
    }
    .special-button  span.material-icons{
      color: #E15554 !important;
    }

    #reload-experiment-btn  span.material-icons{
      color: #E15554 !important;
    }

    .icon-button  span.material-icons{
      padding-top: 2px; 
    }

    .image-color{
      width:50px;
      height:50px;
      color:red;
    }

    img.image-size-big{
      width:50px;
      height:50px;
    }

    img.image-size-normal{
      width:40px;
      height:40px;
    }

    img.image-size-small{
      width:30px;
      height:30px;
    }

    #myInput {
      width: 95%;
      padding: 5px 2%;
      border: 1px solid #ddd;
      margin-bottom: 12px;
      border-radius:5px;
    }
    .modal-input {
      width: 95%;
      padding: 5px 2%;
      border: 1px solid #ddd;
      margin-bottom: 12px;
      border-radius:5px;
    }
    
    .ul-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .ul-list li a {
      text-decoration: none;
      align-items:center;
    }
    .ul-list.ul-add-list li a {
      border-radius:5px;
      padding:10px;
      border: 1px solid #3BB273;
      color: #3BB273;
      transition-duration: 0.4s;
    }
    .ul-list.ul-add-list li a:hover{
      background-color: #3BB273 !important;
      color: white;
    }
    .ul-list.ul-remove-list li a {
      border-radius:5px;
      padding: 0px 5px 2px 5px;
      margin-left: 15px;
      border: 1px solid #E15554;
      color: #E15554;
      transition-duration: 0.4s;
    }
    .ul-list.ul-remove-list li a:hover{
      background-color: #E15554 !important;
      color: white;
    }
      
    .list-to-search{
      max-height: 20vh;
      overflow: auto;
      border: 1px solid #ddd;
      border-left:none;
      border-right:none;
      margin-bottom: 20px;
    }
    .list-selected{
      max-height: 20vh;
      overflow: auto;
    }
    .file-container{
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ddd;
      margin-top: -1px; /* Prevent double borders */
      background-color: #f6f6f6;
      padding: 5px;
      font-size: 15px;
      color: black;
    }

    .anw-container{
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      border: 1px solid #ddd;
      border-radius:10px;
      margin-right: 5px; 
      margin-bottom: 5px;
      padding: 5px 15px ;
      font-size: 15px;
      color: black;
      background-color: #f6f6f6;
    }

    .ul-remove-list{
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
    }
    .list-subtitle{
      margin-bottom: 5px;
      color: black;
      font-size: 20px;
    }
    #error-msj{
      color:black;
      text-align: center;
    }
    .container-button-special{
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
    }
    #you-answ{
      padding-bottom: 15px;
    }

    #snackbar-ok {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #3BB273;
      color: #fff;
      text-align: center;
      border-radius: 15px;
      padding: 0 16px;
      position: fixed;
      z-index: 2;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
    }
    #snackbar-wrong {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #333;
      color: #fff;
      background-color: #E15554;
      text-align: center;
      border-radius: 15px;
      padding: 0 16px;
      position: fixed;
      z-index: 2;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
    }
    
    #snackbar-ok.show {
      visibility: visible;
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    #snackbar-wrong.show {
      visibility: visible;
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
    
    @-webkit-keyframes fadein {
      from {bottom: 0; opacity: 0;} 
      to {bottom: 30px; opacity: 1;}
    }
    
    @keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }
    
    @-webkit-keyframes fadeout {
      from {bottom: 30px; opacity: 1;} 
      to {bottom: 0; opacity: 0;}
    }
    
    @keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }


    .container-radio {
      display: block;
      position: relative;
      padding-left: 50px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 22px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Hide the browser's default radio button */
    .container-radio input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }
    
    /* Create a custom radio button */
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 30px;
      width: 27px;
      background-color: #eee;
      border-radius: 50%;
      padding-left: 15px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: #3BB273;
    }
    .checkmark.two-digits{
      padding: 5px 5px 5px 9px;
      width: 27px;
      height: 30px
    }
    
    /* On mouse-over, add a grey background color */
    .container-radio:hover input ~ .checkmark {
      background-color: #ccc;
    }
    .container-radio input ~ .checkmark {
      transition-duration: 0.4s;
    }
    /* When the radio button is checked, add a blue background */
    .container-radio input:checked ~ .checkmark {
      background-color: #3BB273;
      color: #eee;
    }
    .container-radio-button{
      min-height: 70px;
      display: flex;
      flex-flow: row nowrap;
    }
    
    </style>
  `;
}
function getHTML() {
    return `
  <body>


  <div id="info-modal" class="modal">
    <div class="modal-content">
      <p class="list-subtitle">Informacion del participante:</p>
      <p class="list-subtitle">Nombre del participante:</p>
      <input type="text" id="input-name"  class="modal-input" placeholder="Nombre del participante" title="Nombre del participante">
      <p class="list-subtitle">Tipo de experimento:</p>
      <input type="text" id="input-exp-type" class="modal-input"  placeholder="Tipo de experimento" title="Tipo de experimento">
      
      <a href="Check" id="check-btn-info" class="button composed-button composed-button-big yes-button">
        <p class="icon-text">Revisar conexión con dispositivo</p>
      </a>
      <a href="Ok" id="confirm-btn-info" class="button composed-button composed-button-big yes-button">
        <p class="icon-text">Ok</p>
      </a>
    
    
    </div>
    
  </div>

  


  <div id="snackbar-wrong"></div>
  <div id="snackbar-ok"></div>

 

  <div id="answ-modal" class="modal">
    <div class="modal-content">
      <span class="close" id="answ-close">&times;</span>
      <p class="list-subtitle">Tu respuesta:</p>
      <p id="error-msj">No agregaste ningún archivo a tu respuesta. Si es que crees que algún archivo podria ser parte de la respuesta agregalo.</p>
      <div class="list-selected" id="list-nodes-answ">
        <ul class="ul-list ul-remove-list" id="seleceted-ans-list"></ul>
      </div>
      <div class="list-selected" id="list-folder-answ">
        <ul class="ul-list ul-remove-list" id="seleceted-ans-list-folder"></ul>
      </div>
      <div id="list-nodes">
        <p class="list-subtitle">Lista de archivos</p>
        <input type="text" id="myInput" onkeyup="searchFunction()" placeholder="Buscar por nombre de archivo..." title="Type in a name">
        <div class="list-to-search">
          <ul class="ul-list ul-add-list" id="myUL"></ul>
        </div>
      </div>
      <div id="list-folders">
        <p class="list-subtitle">Lista de folders</p>
        <div class="list-to-search">
          <ul class="ul-list ul-add-list" id="myUL-folder"></ul>
        </div>
      </div>
      <a href="Ok" id="confirm-btn-answ" class="button composed-button composed-button-big yes-button">
        <p class="icon-text">Cerrar</p>
      </a>
      
    </div>
  </div>

  <div id="myModal" class="modal">
    <div class="modal-content">
      <span class="close" id="next-task-close">&times;</span>
      <div id="confirmation-msg">
        <h2 >¿Estas seguro de pasar a la siguiente tarea?</h2>
        <p>Tu repuesta es la siguiente:</p>
        <p id="you-answ"></p>
        <h2 >¿Que tan difícil fue esta tarea? (Siendo 10 muy dificil y 1 muy facil)</h2>

        <div class="container-radio-button">
          <label class="container-radio">
            <input type="radio"  name="radio" value="1">
            <span class="checkmark">1</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="2">
            <span class="checkmark">2</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="3">
            <span class="checkmark">3</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="4">
            <span class="checkmark">4</span>
          </label>
          <label class="container-radio">
            <input type="radio"   name="radio" value="5">
            <span class="checkmark">5</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="6">
            <span class="checkmark">6</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="7">
            <span class="checkmark">7</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="8">
            <span class="checkmark">8</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="9">
            <span class="checkmark">9</span>
          </label>
          <label class="container-radio">
            <input type="radio"  name="radio" value="10">
            <span class="checkmark two-digits">10</span>
          </label>
      </div>
        <div class="buttons-container">
          <a href="Ok" id="confirm-btn" class="button composed-button composed-button-big yes-button">
            <p class="icon-text">Si</p>
            <span class="material-icons">done</span>
          </a>
          <a href="Cancel" id="cancel-btn" class="button composed-button composed-button-big no-button">
            <p class="icon-text">No</p>
            <span class="material-icons">close</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div id="experiment-finished-msg" class="hidded-button">
    <h1>Experimento terminado!<span class="material-icons">task_alt</span></h1>
    <div class="buttons-container">
      <a href="Reload experiment" id="reload-experiment-btn" class="button composed-button composed-button-big">
        <p class="icon-text">Reiniciar Experimento</p>
        <span class="material-icons">restart_alt</span>
      </a>
    </div>
  </div>

  <div id="experiment-container">
    <div class="task-container">
    <h1>Tarea <span class="material-icons">task_alt</span></h1>
    <div class="task-area">
      <p id="task-text"></p>
      <div class="container-button-special">
        <a href="add answer" id="add-answer-btn" class="button composed-button composed-button-big special-button">
          <p class="icon-text">Editar Respuesta</p>
          <span class="material-icons">edit</span>
        </a>

        <a href="Go to Next Task" id="task-btn" class="button composed-button composed-button-big special-button">
          <p class="icon-text">Siguiente</p>
          <span class="material-icons">arrow_forward_ios</span>
        </a>
      </div>
    </div>
  </div>

  <h1 class="build-header">Herramientas del grafo <span class="material-icons">build</span></h1>

  <div class="button-tools">
    <div class="button-controls">
      <div class="card-controls">
        <h2 class="cart-title">Reiniciar Grafo <span class="material-icons">scatter_plot</span></h2>
        <div class="buttons-section">
          <a href="Reiniciar grafo" id="reset-graph-btn" class="button composed-button composed-button-big">
            <p class="icon-text">Reiniciar grafo</p>
            <span class="material-icons">replay</span>
          </a>
	      </div>
	    </div>

      <div class="card-controls">
        <h2 class="cart-title">Rotar Grafo <span class="material-icons">360</span></h2>
        <div class="buttons-section">
          <a href="Rotar horizontalmente" id="rotateH-btn" class="button composed-button composed-button-big">
            <p class="icon-text">Rotar horizontalmente</p>
            <span class="material-icons">swap_horiz</span>
          </a>
          <a href="Rotar verticalmente" id="rotateV-btn" class="button composed-button composed-button-big">
            <p class="icon-text">Rotar verticalmente</p>
            <span class="material-icons">swap_vert</span>
          </a>
        </div>
      </div>

      <div class="card-controls">
        <h2 class="cart-title">Mover Grafo <span class="material-icons">location_on</span></h2>
        <div class="buttons-section ">
          <div class="rotation-container">
            <p class="card-subtitle"> Mover en el eje X:</p>  
            <a  href="+" id="movexF-btn" class="button icon-button"> 
            <span class="material-icons">add</span>
            </a>  
            <a href="-" id="movexB-btn" class="button icon-button">
            <span class="material-icons">remove</span>
            </a>
          </div>

          <div class="rotation-container">
            <p class="card-subtitle">Mover en el eje Y:</p>  
            <a href="+" id="moveyF-btn" class="button icon-button"> 
            <span class="material-icons">add</span>
            </a>  
            <a href="-" id="moveyB-btn" class="button icon-button">
            <span class="material-icons">remove</span>
            </a>
          </div>
        
          <div class="rotation-container">
            <p class="card-subtitle">Mover en el eje Z:</p>  
            <a href="+" id="movezF-btn" class="button icon-button"> 
            <span class="material-icons">add</span>
            </a>  
            <a href="-" id="movezB-btn" class="button icon-button">
            <span class="material-icons">remove</span>
            </a>
          </div>
        </div>
      </div>
      <div class="card-controls">
        <h2 class="cart-title">Tamaño del grafo <span class="material-icons">open_in_full</span></h2>
        <div class="buttons-section">
          <a href="Grande" id="big-s-btn" class="button icon-button image-button ">
            <img  class="image-color image-size-big" src="http://drive.google.com/uc?export=view&id=13t4Ti7AbFnzfVnbwyxJnCrG5MgT5VPie" alt="big graph" color>
            <p>Grande</p>
          </a>
          <a href="Normal" id="normal-s-btn" class="button icon-button image-button ">
            <img  class="image-color image-size-normal" src="http://drive.google.com/uc?export=view&id=13t4Ti7AbFnzfVnbwyxJnCrG5MgT5VPie" alt="big graph" color>
            <p>Normal</p>
          </a>
          <a href="Pequeño" id="little-s-btn" class="button icon-button image-button ">
            <img  class="image-color image-size-small" src="http://drive.google.com/uc?export=view&id=13t4Ti7AbFnzfVnbwyxJnCrG5MgT5VPie" alt="big graph" color>
            <p>Pequeño</p>
          </a>
        </div>
	    </div>
	  </div>

    <div class="card-controls button-filters">
      <div class="button-container">
        <h2 class="cart-title">Filtros de folder
          <span class="material-icons">filter_alt</span>
        </h2>
        <div id="filter-spinner" class="spinner-center">
          <div class="loader"></div>
          <p>Cargando...</p>
        </div>
        <div class="buttons-container" id="button-container"></div>
      </div>
    </div>

  </div>
</div>
  
</body>`;
}
function getScript() {
    return `
    <script>
    let effort=5;
    let currentFilter = "";
    let dataSetfilters = [];
    let tasks = ["Loading ..."];
    
    let nodes = [];
    let folders = [];
    let nodesSelected = [];
    let taskId = 0;
    const baseUrl = "http://localhost:3000/";
    const baseUrlLocal = "http://localhost:3000/";
    const header = {
      headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    };

    function searchFunction() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
          a = li[i].getElementsByTagName("span")[0];
          txtValue = a.textContent || a.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1 && !nodesSelected.some(n=> n==txtValue+"")) {
            li[i].style.display = "";
          } else {
            li[i].style.display = "none";
          }
      }
    }

    function selectSrc(event) {
      event.preventDefault();
      fetch(this.srcUrl, header).then((response) => {
      if (response.status === 200) {
        showSnackbar(this.msj);
      } else {
        showSnackbarError("Hubo un error al momento de seleccionar el filtro. Vuelve a intentarlo");
      }
      });
    }
    
    function addNodesToModalList(){
      const nodeList = document.getElementById("myUL");
      nodes.forEach(n=>{
        nodeList.innerHTML+="<li><div class='file-container'><span>"+n+"</span><a value='"+n+"' href='#'> Agregar a respuesta</a></div></li>";
      });
    }

    function addNodesToModalAnswList(){
      const nodeListSelected = document.getElementById("seleceted-ans-list");
      nodes.forEach(n=>{
        nodeListSelected.innerHTML+="<li style='display: none;'><div class='anw-container'><span>"+n+"</span><a value='"+n+"' href='#'> &times;</a></div></li>";
      });
    }
    function addFolderToModalList(){
      const folderList = document.getElementById("myUL-folder");
      folders.forEach(n=>{
        folderList.innerHTML+="<li><div class='file-container'><span>"+n+"</span><a value='"+n+"' href='#'> Agregar a respuesta</a></div></li>";
      });
    }

    function addFolderToModalAnswList(){
      const folderListSelected = document.getElementById("seleceted-ans-list-folder");
      folders.forEach(n=>{
        folderListSelected.innerHTML+="<li style='display: none;'><div class='anw-container'><span>"+n+"</span><a value='"+n+"' href='#'> &times;</a></div></li>";
      });
    }
    
    function callGetHttpAllGraph() {
      fetch(baseUrlLocal + "graph", {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
      })
      .then((response) => {
        if (response.status === 200) {
          showSnackbar("Se conecto a sevidor exitosamente");
        } else {
          showSnackbarError("Hubo un error al intentar conectarse al sevidor. Vuelve a intentarlo");
        }
        return response.json();
      })
      .then((jsonResponse) => {
        tasks = jsonResponse.tasks;
        nodes = jsonResponse.nodes.map((n) => n.name);
        folders = jsonResponse.filters.map((n) => n.name);
        addNodesToModalList();
        addNodesToModalAnswList();
        addFolderToModalList();
        addFolderToModalAnswList();
        addListenerToAddAnswButtons();
        addListenerToAddFoldersAnswButtons();
        addListenerToRemoveAnswButtons();
        addListenerToRemoveFolderAnswButtons();
        reloadErrorMsj();
        document.getElementById("filter-spinner").classList.add("hidded-button");
        const filtersList = document.getElementById("button-container");
        jsonResponse.filters.forEach((f, index) => {
        filtersList.innerHTML +=
          '<a href="' +
          f.name +
          '"  id="' +
          f.name +
          '" class="button composed-button filter-button"><p class="filter-name">' +
          f.name +
          '</p><span class="filter-circle" style="background-color: ' +
          f.color +
          ';"></span></a>';
        dataSetfilters.push(f.name);
        });
        if (jsonResponse.filters.length > 0) {
        filtersList.innerHTML +=
          '<a href="Hide all" id="transparent-btn" class="button composed-button composed-button-big"><p class="icon-text">Hide All</p><span class="material-icons">visibility_off</span></a>';
        }
        setFiltersListeners.bind({ filtersAdded: dataSetfilters })();
      })
      .catch((error) => {
        showSnackbarError("Hubo un error al intentar conectarse al sevidor. Vuelve a intentarlo");
      });
    }

    function resetAnsw(){
      var posUl, posIi, a, i;
      posUl = document.getElementById("myUL");
      posIi = posUl.getElementsByTagName("li");
      const answUl = document.getElementById("seleceted-ans-list");
      const answLi = answUl.getElementsByTagName("li");
      nodesSelected = [];
      for (i = 0; i < posIi.length; i++) {
        a = posIi[i].getElementsByTagName("a")[0];
        const elementSelected = posIi[i];
        const elementSelectedAnsw = answLi[i];
        elementSelected.style.display = "";
        elementSelectedAnsw.style.display = "none";
      }
    }
    
    function calHttpGetAction(event) {
      event.preventDefault();
      fetch(this.srcUrl, header)
      .then((response) => {
        if (response.status === 200) {
        showSnackbar(this.msj);
        } else {
        showSnackbarError(this.msjErr);
        }
      })
      .catch((error) => {
        showSnackbarError(this.msjErr);
      });
    }

    function calHttpGetConnectionStatus(event) {
      event.preventDefault();
      fetch(this.srcUrl, header)
      .then((response) => {
        if (response.status !== 200) {
          showSnackbarError(this.msjErr);
        }
        return response.json();
      })
      .then((jsonResponse) => {
        if(jsonResponse.status){
          showSnackbar(this.msj);
        }else{
          showSnackbarError(this.msjErr);
        }
      })
      .catch((error) => {
        showSnackbarError("No se pudo connectar con el servidor.");
      });
    }
    
    function selectFilter(name) {
      return selectSrc.bind({
      srcUrl: baseUrl + "graph-color/toggle/" + name,
      msj: "El filtro " + "'" + name + "'" + " se uso efectivamente",
      });
    }
    function showFinishedMsj(){
      if (taskId == tasks.length) {
        document
          .getElementById("experiment-finished-msg")
          .classList.remove("hidded-button");
        document
          .getElementById("experiment-container")
          .classList.add("hidded-button");
      }
    }

    function getEffort(){
      var radios = document.getElementsByName('radio');
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          effort =radios[i].value;
          console.log(effort);
          return true;
        }
      }
      return false;
    }

    function startExp(){
      document.getElementById("experiment-container").classList.remove("hidded-button");
      document.getElementById("info-exp").classList.add("hidded-button");
    }
    function reloadErrorMsj(){
      console.log('tasks[taskId].folderType');
      console.log(tasks[taskId].folderType);
      document.getElementById("task-text").textContent = tasks[taskId].question;
      document.getElementById("error-msj").style.display ="";
      document.getElementById("error-msj").innerHTML = (tasks[taskId].qtyAns == 0 ) ? 'No agregaste ningún archivo a tu respuesta. Si es que crees que algún archivo podria estar en la respuesta agregalo.' : ('Tu respuesta debe tener mínimo ' +tasks[taskId].qtyAns+ ' archivo/s');
      if(tasks[taskId].qtyAns != 0){
        document.getElementById("task-btn").classList.add("hidded-button");
      }
      if(tasks[taskId].folderType){
        document.getElementById("list-folders").classList.remove("hidded-button");
        document.getElementById("list-folder-answ").classList.remove("hidded-button");

        document.getElementById("list-nodes").classList.add("hidded-button");
        document.getElementById("list-nodes-answ").classList.add("hidded-button");
      } else {
        document.getElementById("list-folders").classList.add("hidded-button");
        document.getElementById("list-folder-answ").classList.add("hidded-button");

        document.getElementById("list-nodes").classList.remove("hidded-button");
        document.getElementById("list-nodes-answ").classList.remove("hidded-button");
      }
    }
    function resetRadioButtons(){
      var radios = document.getElementsByName('radio');
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          radios[i].checked =false;
        }
      }
    }

    
    function changeTask(event) {
      if(getEffort()){
        event.preventDefault();
        modal.style.display = "none";
        const ans = {answer: Object.assign({}, nodesSelected)};
        ans.effort = effort;
        const options = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            },
          body: JSON.stringify(ans),
        };
  
        fetch(baseUrl + "graph-tasks/next", options)
        .then((response) => {
          if (response.status === 201) {
            taskId++;
            resetRadioButtons();
            if (taskId != tasks.length) {
              reloadErrorMsj();
              resetAnsw();
              showSnackbar("Los datos se guardaron exitosamente");
            }
            else{
              finishExperiment();
              showFinishedMsj();
            }          
          } else {
            showSnackbarError("Hubo un error al intentar cambiar de tarea. Vuelve a intentarlo");
          }
        })
        .catch((error) => {
          showSnackbarError("Hubo un error al intentar cambiar de tarea. Vuelve a intentarlo");
        });
      }else{
        showSnackbarError("Selecciona un puntaje de esfuerzo.");
      }
    }
    
    function setFiltersListeners() {
      this.filtersAdded.forEach((f, index) => {
      document
        .getElementById(String(f))
        .addEventListener("click", selectFilter(f));
      });
      if (this.filtersAdded.length > 0) {
        document
          .getElementById("transparent-btn")
          .addEventListener(
          "click",
          calHttpGetAction.bind({ 
              srcUrl: baseUrl + "graph-color/transparent",
              msj: "Se ocultó el grafo",
              msjErr:"Hubo un error al tratar de ocultar el grafo. Vuelve a intentarlo",
            })
          );
      }
    }
    
    function restartExperiment() {
      // document
      // .getElementById("experiment-finished-msg")
      // .classList.add("hidded-button");
      // document
      // .getElementById("experiment-container")
      // .classList.remove("hidded-button");
      // taskId = 0;
      // const curTaskHTML = document.getElementById("task-text");
      // curTaskHTML.textContent = tasks[taskId].question;
    }
    function showSnackbar(messaje) {
      var x = document.getElementById("snackbar-ok");
      x.className = "show";
      x.innerHTML = "<p>"+messaje+"</p>";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    
    function showSnackbarError(messaje) {
      var x = document.getElementById("snackbar-wrong");
      x.className = "show";
      x.innerHTML = "<p>"+messaje+"</p>";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    function resetGraph() {
      event.preventDefault();
      fetch(baseUrl + "graph-color/reset", header)
      .then((response) => {
        if (response.status === 200) {
        showSnackbar("El grafo se reinició exitosamente");
        } else {
          showSnackbarError("Hubo un error al tratar de reiniciar el grafo. Vuelve a intentarlo");
        }
      })
      .catch((error) => {
        showSnackbarError("Hubo un error al tratar de reiniciar el grafo. Vuelve a intentarlo");
      });
    }
    
    function finishExperiment() {
      fetch(baseUrl + "graph-tasks/finish", header)
      .then((response) => {
        if (response.status === 200) {
        showSnackbar("Se finalizo el experimento");
        } else {
          showSnackbarError("Hubo un error al tratar de finalizar el experimento. Vuelve a intentarlo");
        }
      })
      .catch((error) => {
        showSnackbarError("Hubo un error al tratar de finalizar el experimento. Vuelve a intentarlo");
      });
    }

    function sendExperimentData(user, type) {
      const ans = {user:user, type:type};
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          },
        body: JSON.stringify(ans),
      };
      fetch(baseUrl + "graph-tasks/set-user", options)
      .then((response) => {
        if (response.status === 201) {
          showSnackbar("Los datos fueron guardados!");
        } else {
          showSnackbarError("Hubo un error al tratar de finalizar el experimento. Vuelve a intentarlo");
        }
      })
      .catch((error) => {
        showSnackbarError("Hubo un error al tratar de finalizar el experimento. Vuelve a intentarlo");
      });
    }
    

    document.getElementById("rotateH-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-rotation/horizontal",
      msj: "La rotación horizontal del grafo cambió",
      msjErr:
        "Hubo un error al tratar de cambiar la rotación horizontal. Vuelve a intentarlo",
      })
    );
    document.getElementById("rotateV-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-rotation/vertical",
      msj: "La rotación vertical del grafo cambió",
      msjErr:
        "Hubo un error al tratar de cambiar la rotación vertical. Vuelve a intentarlo",
      })
    );
    
    document.getElementById("movexB-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/x-backward",
      msj: "El grafo es movió negativamente en el eje x",
      msjErr:
        "Hubo un error al tratar de mover el grafo negativamente en el eje x. Vuelve a intentarlo",
      })
    );
    document.getElementById("moveyB-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/y-backward",
      msj: "El grafo es movió negativamente en el eje y",
      msjErr:
        "Hubo un error al tratar de mover el grafo negativamente en el eje y. Vuelve a intentarlo",
      })
    );
    document.getElementById("movezB-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/z-backward",
      msj: "El grafo es movió negativamente en el eje z",
      msjErr:
        "Hubo un error al tratar de mover el grafo negativamente en el eje z. Vuelve a intentarlo",
      })
    );
    document.getElementById("movexF-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/x-forward",
      msj: "El grafo es movió positivamente en el eje x",
      msjErr:
        "Hubo un error al tratar de mover el grafo positivamente en el eje x. Vuelve a intentarlo",
      })
    );
    document.getElementById("moveyF-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/y-forward",
      msj: "El grafo es movió positivamente en el eje y",
      msjErr:
        "Hubo un error al tratar de mover el grafo positivamente en el eje y. Vuelve a intentarlo",
      })
    );
    document.getElementById("movezF-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-movement/z-forward",
      msj: "El grafo es movió positivamente en el eje z",
      msjErr:
        "Hubo un error al tratar de mover el grafo positivamente en el eje z. Vuelve a intentarlo",
      })
    );
    document.getElementById("big-s-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-size/big",
      msj: "El grafo cambió de tamaño a grande",
      msjErr:
        "Hubo un error al tratar de cambiar el tamaño a grande. Vuelve a intentarlo",
      })
    );
    document.getElementById("normal-s-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-size/normal",
      msj: "El grafo cambió de tamaño a normal",
      msjErr:
        "Hubo un error al tratar de cambiar el tamaño a normal. Vuelve a intentarlo",
      })
    );
    document.getElementById("little-s-btn").addEventListener(
      "click",
      calHttpGetAction.bind({
      srcUrl: baseUrl + "graph-size/small",
      msj: "El grafo cambió de tamaño a pequeño",
      msjErr:
        "Hubo un error al tratar de cambiar el tamaño a pequeño. Vuelve a intentarlo",
      })
    );
    document.getElementById("confirm-btn").addEventListener("click", changeTask);
    
    document
      .getElementById("reset-graph-btn")
      .addEventListener("click", resetGraph);
    
    callGetHttpAllGraph.bind({ graphUrl: baseUrl + "graph" })();
    document
      .getElementById("experiment-finished-msg")
      .addEventListener("click", restartExperiment);
    
    var modal = document.getElementById("myModal");
    var modalAnsw = document.getElementById("answ-modal");
    var modalInfo = document.getElementById("info-modal");
    var btn = document.getElementById("task-btn");
    var btnAnsw = document.getElementById("add-answer-btn");
    var modalSpan = document.getElementById("next-task-close");
    var modalAnswSpan = document.getElementById("answ-close");
    var modalInfoCloseBtn = document.getElementById("confirm-btn-info");
    
    document.getElementById("cancel-btn").onclick = function () {
      modal.style.display = "none";
    };
    document.getElementById("check-btn-info").addEventListener(
      "click",
      calHttpGetConnectionStatus.bind({ 
        srcUrl: baseUrl + "graph-connection",
        msj: "Se encontro un dispositivo conectado",
        msjErr:"No hay ningun dispositivo conectado",
      })
    );

    
    btn.onclick = function () {
      modal.style.display = "block";
      if(nodesSelected.length ==0){
        document.getElementById("you-answ").innerHTML = "Respuesta vacia.";
      }
      else{
        document.getElementById("you-answ").innerHTML = "";
        nodesSelected.forEach(n=> {
          document.getElementById("you-answ").innerHTML += "<p>- "+n+"</p>";
        });
      }
    };
  
    modalSpan.onclick = function () {
      modal.style.display = "none";
    };
    
    btnAnsw.onclick = function () {
      modalAnsw.style.display = "block";
    };
    
    modalAnswSpan.onclick = function () {
      modalAnsw.style.display = "none";
    };

    modalInfoCloseBtn.onclick = function () {
      var inputName, inputExpType;
      inputName = document.getElementById("input-name").value.trim();
      inputExpType = document.getElementById("input-exp-type").value.trim();
      if(inputName.length > 0 && inputExpType.length > 0 ){
        modalInfo.style.display = "none";
        sendExperimentData(inputName, inputExpType);
        showSnackbar("Los datos fueron guardados!");
      }
      else{
        showSnackbarError("LLena los datos para el experimento para continuar");
      }
    };

    document.getElementById("confirm-btn-answ").onclick = function () {
      modalAnsw.style.display = "none";
    };
    

    function addListenerToAddAnswButtons() {
      var posUl, posIi, a, i;

      posUl = document.getElementById("myUL");
      posIi = posUl.getElementsByTagName("li");
      const answUl = document.getElementById("seleceted-ans-list");
      const answLi = answUl.getElementsByTagName("li");
      for (i = 0; i < posIi.length; i++) {
        a = posIi[i].getElementsByTagName("a")[0];
        const txtValue = posIi[i].getElementsByTagName("span")[0].innerText;
        const elementSelected = posIi[i];
        const elementSelectedAnsw = answLi[i];
    
        a.onclick = function() {
          if(tasks[taskId].qtyAns==0 ||  nodesSelected.length < tasks[taskId].qtyAns){
            elementSelected.style.display = "none";
            elementSelectedAnsw.style.display = "";
            nodesSelected.push(txtValue);
            if(nodesSelected.length != 0){
              const errorMsj = document.getElementById("error-msj");
              errorMsj.style.display = "none";
            }
            if(nodesSelected.length < tasks[taskId].qtyAns){
              document.getElementById("task-btn").classList.add("hidded-button");
            }

            if(nodesSelected.length >= tasks[taskId].qtyAns){
              document.getElementById("task-btn").classList.remove("hidded-button");
            }

            
          }  else{
            showSnackbarError("La cantidad maxima de respuestas para esta pregunta es "+tasks[taskId].qtyAns);
          }
        }
      
      }
    }

    function addListenerToAddFoldersAnswButtons() {
      var posUl, posIi, a, i;

      posUl = document.getElementById("myUL-folder");
      posIi = posUl.getElementsByTagName("li");
      const answUl = document.getElementById("seleceted-ans-list-folder");
      const answLi = answUl.getElementsByTagName("li");
      for (i = 0; i < posIi.length; i++) {
        a = posIi[i].getElementsByTagName("a")[0];
        const txtValue = posIi[i].getElementsByTagName("span")[0].innerText;
        const elementSelected = posIi[i];
        const elementSelectedAnsw = answLi[i];
    
        a.onclick = function() {
          if(tasks[taskId].qtyAns==0 ||  nodesSelected.length < tasks[taskId].qtyAns){
            elementSelected.style.display = "none";
            elementSelectedAnsw.style.display = "";
            nodesSelected.push(txtValue);
            if(nodesSelected.length != 0){
              const errorMsj = document.getElementById("error-msj");
              errorMsj.style.display = "none";
            }
            if(nodesSelected.length < tasks[taskId].qtyAns){
              document.getElementById("task-btn").classList.add("hidded-button");
            }

            if(nodesSelected.length >= tasks[taskId].qtyAns){
              document.getElementById("task-btn").classList.remove("hidded-button");
            }
          }
          else{
            showSnackbarError("La cantidad maxima de respuestas para esta pregunta es "+tasks[taskId].qtyAns);
          }
        }
      }
    }

    function removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }

    function addListenerToRemoveAnswButtons() {
      var ul, li, a, i,answUl;
      ul = document.getElementById("myUL");
      li = ul.getElementsByTagName("li");
      answUl = document.getElementById("seleceted-ans-list");
      answLi = answUl.getElementsByTagName("li");
      for (i = 0; i < answLi.length; i++) {
        a = answLi[i].getElementsByTagName("a")[0];
        const txtValue = answLi[i].getElementsByTagName("span")[0].innerText;
        const elementSelectedAnsw = answLi[i];
        const elementSelected = li[i];
        a.onclick = function() {
          elementSelectedAnsw.style.display = "none";
          elementSelected.style.display = "";
          nodesSelected = removeItemOnce(nodesSelected, txtValue);
          if(nodesSelected.length == 0){
            const errorMsj = document.getElementById("error-msj");
            errorMsj.style.display = "";
          }
          if(nodesSelected.length < tasks[taskId].qtyAns){
            document.getElementById("task-btn").classList.add("hidded-button");
          }
        }
      }
    }

    function addListenerToRemoveFolderAnswButtons() {
      var ul, li, a, i,answUl;
      ul = document.getElementById("myUL-folder");
      li = ul.getElementsByTagName("li");
      answUl = document.getElementById("seleceted-ans-list-folder");
      answLi = answUl.getElementsByTagName("li");
      for (i = 0; i < answLi.length; i++) {
        a = answLi[i].getElementsByTagName("a")[0];
        const txtValue = answLi[i].getElementsByTagName("span")[0].innerText;
        const elementSelectedAnsw = answLi[i];
        const elementSelected = li[i];
        a.onclick = function() {
          elementSelectedAnsw.style.display = "none";
          elementSelected.style.display = "";
          nodesSelected = removeItemOnce(nodesSelected, txtValue);
          if(nodesSelected.length == 0){
            const errorMsj = document.getElementById("error-msj");
            errorMsj.style.display = "";
          }
          if(nodesSelected.length < tasks[taskId].qtyAns){
            document.getElementById("task-btn").classList.add("hidded-button");
          }
        }
      }
    }
    
    modalInfo.style.display = "block";
    
    </script> 
  `;
}
function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en-us">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Unity WebGL Player | Visualization Graph Layout</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
      ${getCssStyle()}
    </head>
    ${getHTML()}
    ${getScript()}
  </html>
  `;
}
//# sourceMappingURL=extension.js.map