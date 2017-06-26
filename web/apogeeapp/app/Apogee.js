apogeeapp.app = {};
apogeeapp.app.dialog = {};

/** This is the main class of the apogee application. */
apogeeapp.app.Apogee = function(containerId) {
    
    //temp - until we figure out what to do with menu and events
    //for now we have application events, using the EventManager mixin below.
    apogee.EventManager.init.call(this);
    
    //workspaces
    this.workspaceUI = null;
    
    //component generators
    this.componentGenerators = {};
    this.standardComponents = [];
    //these are a list of names of components that go in the "added component" list
    this.additionalComponents = [];
	
	this.linkManager = new apogeeapp.app.LinkManager();
	
	//load the standard component generators
	this.loadComponentGenerators();
	
	//create the UI
	this.createUI(containerId);
    
    //open a workspace - from url or default
    var workspaceUrl = apogee.util.readQueryField("url",document.URL);
    if(workspaceUrl) {
        apogeeapp.app.openworkspace.openWorkspaceFromUrl(this,workspaceUrl);
    }
    else {
        //create a default workspace 
        apogeeapp.app.createworkspace.createWorkspace(this);
    }
}
	
//add components to this class
apogee.base.mixin(apogeeapp.app.Apogee,apogee.EventManager);

apogeeapp.app.Apogee.DEFAULT_WORKSPACE_NAME = "workspace";

apogeeapp.app.Apogee.prototype.getWorkspaceUI = function() {
	return this.workspaceUI;
}

apogeeapp.app.Apogee.prototype.getWorkspace = function() {
	if(this.workspaceUI) {
		return this.workspaceUI.getWorkspace();
	}
	else {
		return null;
	}
}

//==================================
// Workspace Management
//==================================

/** This method makes an empty workspace ui object. This throws an exception if
 * the workspace can not be opened.
 */
apogeeapp.app.Apogee.prototype.setWorkspaceUI = function(workspaceUI) {
    
    //we can only have one workspace of a given name!
    if(this.workspaceUI) {
        throw apogee.base.createError("There is already an open workspace",false);
    }
    
    workspaceUI.setApp(this,this.tabFrame,this.treePane);
    this.workspaceUI = workspaceUI;
    return true;
}

/** This method closes the active workspace. */
apogeeapp.app.Apogee.prototype.clearWorkspaceUI = function() {
    //remove the workspace from the app
    this.workspaceUI = null;
    
    return true;
}

//==================================
// Link Management
//==================================

/** This method adds links as registered by a given workspace. Links can be added and
 * removed. Removing links may or may not remove them from the page (currently
 * js links are not removed and css links are, once they are not used by any 
 * workspase. The linksLoadedCallback is optional. It is called when all links have
 * been loaded on the page.
 */
apogeeapp.app.Apogee.prototype.updateWorkspaceLinks = function(ownerName,addList,removeList,linksLoadedCallback) {
	this.linkManager.updateWorkspaceLinks(ownerName,addList,removeList,linksLoadedCallback);
}

//=================================
// Component Management
//=================================

/** This method registers a component. */
apogeeapp.app.Apogee.prototype.registerComponent = function(componentGenerator) {
    var name = componentGenerator.uniqueName;
    if(this.componentGenerators[name]) {
//in the future we can maybe do something other than punt
        alert("There is already a registered component with this name. Either the component has already been added of the name is not unique.");
        return;
    }

//we should maybe warn if another component bundle is being overwritten 
    this.componentGenerators[name] = componentGenerator;
    this.additionalComponents.push(name);
}

/** This method registers a component. */
apogeeapp.app.Apogee.prototype.getComponentGenerator = function(name) {
	return this.componentGenerators[name];
}
//==========================
// App Initialization
//==========================

/** This method adds the standard components to the app. 
 * @private */
apogeeapp.app.Apogee.prototype.loadComponentGenerators = function() {
    //standard components
    this.registerStandardComponent(apogeeapp.app.JsonTableComponent.generator);
    this.registerStandardComponent(apogeeapp.app.GridTableComponent.generator);
    this.registerStandardComponent(apogeeapp.app.TextComponent.generator);
	this.registerStandardComponent(apogeeapp.app.FolderComponent.generator);
	this.registerStandardComponent(apogeeapp.app.FunctionComponent.generator);
    this.registerStandardComponent(apogeeapp.app.FolderFunctionComponent.generator);
	
    //additional components
    this.registerComponent(apogeeapp.app.CustomControlComponent.generator);
}

/** This method registers a component. 
 * @private */
apogeeapp.app.Apogee.prototype.registerStandardComponent = function(componentGenerator) {
    var name = componentGenerator.uniqueName;
    if(this.componentGenerators[name]) {
//in the future we can maybe do something other than punt
        alert("There is already a registered component with this name. Either the component has already been added of the name is not unique.");
        return;
    }

//we should maybe warn if another component bundle is being overwritten 
    this.componentGenerators[name] = componentGenerator;
    this.standardComponents.push(name);
}

/** This method creates the app ui. 
 * @private */
apogeeapp.app.Apogee.prototype.createUI = function(containerId) {
    
    var windowElements = apogeeapp.ui.initWindows(containerId);
    var topContainer = windowElements.baseElement;
    
    var mainContainer = new apogeeapp.ui.DisplayAndHeader(apogeeapp.ui.DisplayAndHeader.FIXED_PANE,
            null,
            apogeeapp.ui.DisplayAndHeader.FIXED_PANE,
            null
        );
    topContainer.appendChild(mainContainer.getOuterElement());
    
    //-------------------
    //create menus
    //-------------------
    var menuBar = this.createMenuBar();
    mainContainer.getHeader().appendChild(menuBar);
    
    //----------------------
    //create the split pane
    //----------------------
    var splitPane = new apogeeapp.ui.SplitPane(
            apogeeapp.ui.SplitPane.SCROLLING_PANE,
            apogeeapp.ui.SplitPane.FIXED_PANE
        );
    mainContainer.getBody().appendChild(splitPane.getOuterElement());

    //---------------------
    //load the tree pane
    //---------------------
    this.treePane = splitPane.getLeftPaneContainer();
    
    //----------------------
    //create the tab frame
    //----------------------
    this.tabFrame = new apogeeapp.ui.TabFrame();
    splitPane.getRightPaneContainer().appendChild(this.tabFrame.getElement());
    
    //add listener for displaying the active tab
    var instance = this;
    this.tabFrame.addListener(apogeeapp.ui.TabFrame.TAB_SHOWN,function(tabId){instance.onTabShown(tabId);});
    this.tabFrame.addListener(apogeeapp.ui.TabFrame.TAB_HIDDEN,function(tabId){instance.onTabHidden(tabId);});

}

/** This method creates the app ui. 
 * @private */
apogeeapp.app.Apogee.prototype.onTabHidden = function(tabId) {
    this.activeTabIconDisplay.style.display = "none";
    this.activeTabTitleDisplay.style.display = "none";
}

apogeeapp.app.Apogee.prototype.onTabShown = function(tabId) {
    var component = this.workspaceUI.getComponentById(tabId);
    if(component) {
        this.activeTabIconDisplay.src = component.getIconUrl();
        this.activeTabTitleDisplay.innerHTML = component.getObject().getDisplayName(true);
        this.activeTabIconDisplay.style.display = "";
        this.activeTabTitleDisplay.style.display = "";
    }
}

//=================================
// Menu Functions
//=================================

/** This method creates the creates the menu bar, with the attached functionality. 
 * @private */
apogeeapp.app.Apogee.prototype.createMenuBar = function() {
    
    //-------------------
    //create menus
    //-----------------------
    
    //create the menus
    var menu;
    var name;
    var menus = {};
    
    //creat menu  bar with left elements (menus) and right elements (active tab display)
    var menuBar = apogeeapp.ui.createElementWithClass("div","menu_bar");
    var menuBarLeft = apogeeapp.ui.createElementWithClass("div","menu_bar_left",menuBar);
    var menuBarRight = apogeeapp.ui.createElementWithClass("div","menu_bar_right",menuBar);

    //Workspace menu
    name = "Workspace";
    menu = apogeeapp.ui.Menu.createMenu(name);
    menuBarLeft.appendChild(menu.getElement());
    menus[name] = menu;
    
    var newCallback = apogeeapp.app.createworkspace.getCreateCallback(this);
    menu.addCallbackMenuItem("New",newCallback);
    
    var openCallback = apogeeapp.app.openworkspace.getOpenCallback(this);
    menu.addCallbackMenuItem("Open",openCallback);
    
    var saveCallback = apogeeapp.app.saveworkspace.getSaveCallback(this);
    menu.addCallbackMenuItem("Save",saveCallback);
    
    var closeCallback = apogeeapp.app.closeworkspace.getCloseCallback(this);
    menu.addCallbackMenuItem("Close",closeCallback);	
	
    //Components Menu
    name = "Components";
    menu = apogeeapp.ui.Menu.createMenu(name);
    menuBarLeft.appendChild(menu.getElement());
    menus[name] = menu;
    
    //add create child elements
    this.populateAddChildMenu(menu);
    
    //libraries menu
    name = "Libraries";
    menu = apogeeapp.ui.Menu.createMenu(name);
    menuBarLeft.appendChild(menu.getElement());
    menus[name] = menu;
    
    var linksCallback = apogeeapp.app.updatelinks.getUpdateLinksCallback(this);
    menu.addCallbackMenuItem("Update Links",linksCallback);
    
    var importCallback = apogeeapp.app.importworkspace.getImportCallback(this,apogeeapp.app.FolderComponent.generator);
    menu.addCallbackMenuItem("Import as Folder",importCallback);
    
    var import2Callback = apogeeapp.app.importworkspace.getImportCallback(this,apogeeapp.app.FolderFunctionComponent.generator);
    menu.addCallbackMenuItem("Import as Folder Function",import2Callback);
    
    var exportCallback = apogeeapp.app.exportworkspace.getExportCallback(this);
    menu.addCallbackMenuItem("Export as Workspace",exportCallback);
    
    //allow the implementation to add more menus or menu items
    if(this.addToMenuBar) {
        this.addToMenuBar(menuBar,menus);
    }
    
    //add the active tab display
    this.activeTabIconDisplay = apogeeapp.ui.createElementWithClass("img","tab-icon-display",menuBarRight);
    this.activeTabIconDisplay.style.display = "none";
    this.activeTabTitleDisplay = apogeeapp.ui.createElementWithClass("div","tab-title-display",menuBarRight);
    this.activeTabTitleDisplay.style.display = "none";
    return menuBar;
    
}

///** This method should be implemented if custom menus or menu items are desired. */
//apogeeapp.app.Apogee.prototype.addToMenuBar(menuBar,menus);

apogeeapp.app.Apogee.prototype.populateAddChildMenu = function(menu,optionalInitialValues,optionalComponentOptions) {
    
    for(var i = 0; i < this.standardComponents.length; i++) {
        var key = this.standardComponents[i];
        var generator = this.componentGenerators[key];
        var title = "Add " + generator.displayName;
        var callback = apogeeapp.app.addcomponent.getAddComponentCallback(this,generator,optionalInitialValues,optionalComponentOptions);
        menu.addCallbackMenuItem(title,callback);
    }

    //add the additional component item
    var componentCallback = apogeeapp.app.addcomponent.getAddAdditionalComponentCallback(this,optionalInitialValues,optionalComponentOptions);
    menu.addCallbackMenuItem("Other Components...",componentCallback);
}

/** This loads the context menu for the key. It should be update if
 *the key index changes. */
apogeeapp.app.Apogee.prototype.setFolderContextMenu = function(contentElement,folder) {
    
    var app = this;

    var initialValues = {};
    initialValues.parentName = folder.getFullName();
    
    contentElement.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        //position the window if we can
        if(event.offsetX) {
            var componentOptions = {};
            var coordInfo = {};
            coordInfo.x = event.offsetX;
            coordInfo.y = event.offsetY;
            componentOptions.coordInfo = coordInfo;
        }
        
        var contextMenu = new apogeeapp.ui.MenuBody();
        app.populateAddChildMenu(contextMenu,initialValues,componentOptions);
        
        apogeeapp.ui.Menu.showContextMenu(contextMenu,event);
    }
}
