/** This component represents a json table object. */
apogeeapp.app.TabComponentDisplay = function(component) {
    this.component = component;
    this.object = component.getObject();
    
    this._loadTabEntry();
    
    //add a cleanup action to the base component - component must already be initialized
//    this.addCleanupAction(apogeeapp.app.EditDisplayContent.destroy);
};

apogeeapp.app.TabComponentDisplay.prototype.getTab = function() {
    return this.tab;
}

apogeeapp.app.TabComponentDisplay.prototype.closeTab = function() {
    if(this.tab) {
        this.tab.close();
        this.tab = null;
    }
}

apogeeapp.app.TabComponentDisplay.prototype.setBannerState = function(bannerState,bannerMessage) {
    if(bannerState == apogeeapp.app.WindowHeaderManager.BANNER_TYPE_NONE) {
        this.windowHeaderManager.hideBannerBar();
    }
    else {
        this.windowHeaderManager.showBannerBar(bannerMessage,bannerState);
    }
}

apogeeapp.app.TabComponentDisplay.prototype.updateData = function() {
    this.tab.setName(this.object.getName());
}

/** This creates and adds a display for the child component to the parent container. */
apogeeapp.app.TabComponentDisplay.prototype.addChildComponent = function(childComponent) {
    
    var windowComponentDisplay = childComponent.createWindowDisplay();
    var childWindow = windowComponentDisplay.getWindowEntry();

    childWindow.setParent(this.parentContainer);
    
    //set position
    var pos = windowComponentDisplay.getPreferredPosition();
    if(!pos) {
        pos = this.parentContainer.getNextWindowPosition();
    }
    childWindow.setPosition(pos.x,pos.y);
    
    childWindow.show();
    
    //set state 
    var state = windowComponentDisplay.getPreferredState();
    childWindow.setWindowState(state);
}

//===============================
// Private Functions
//===============================

/** @private */
apogeeapp.app.TabComponentDisplay.prototype._loadTabEntry = function() {
    this.tab = this.component.getWorkspaceUI().requestTab(this.object.getId(),true);
    
    //-----------------------
    //add headers for display
    //-----------------------
    this.windowHeaderManager = new apogeeapp.app.WindowHeaderManager();
    this.tab.setContent(this.windowHeaderManager.getOuterElement());

    //-----------------------
    //set the content
    //-----------------------
    this._createDisplayContent();
    this.windowHeaderManager.setContent(this.contentElement);
    
    //------------------
    // set menu
    //------------------
    var menu = this.tab.createMenu(this.component.getIconUrl());
    
    //menu items
    var menuItemInfoList = [];
    
    //add the standard entries
    var itemInfo = {};
    itemInfo.title = "Edit Properties";
    itemInfo.callback = apogeeapp.app.updatecomponent.getUpdateComponentCallback(this.component);
    menuItemInfoList.push(itemInfo);
    
    //only allow delete if the object has a parent (not if it has a non-parent owner, or is a root object)
    if(this.object.getParent()) {
        var itemInfo = {};
        itemInfo.title = "Delete";
        itemInfo.callback = this.component.createDeleteCallback(itemInfo.title);
        menuItemInfoList.push(itemInfo);
    }
    
    //set the menu items
    menu.setMenuItems(menuItemInfoList);
    
    //-----------------
    //set the tab title
    //-----------------
    this.tab.setName(this.object.getName());
    
    //-----------------------------
    //add the handlers for the tab
    //-----------------------------
    var instance = this;
    var onClose = function() {
        instance.component.closeTabDisplay();
        instance.destroy();
    }
    this.tab.addListener(apogeeapp.ui.CLOSE_EVENT,onClose);
}

apogeeapp.app.TabComponentDisplay.PARENT_CONTAINER_STYLE = {
    "position":"relative",
    "display":"table",
    "width":"100%",
    "height":"100%",
    "top":"0px",
    "left":"0px"
}

 /** @private */
apogeeapp.app.TabComponentDisplay.prototype._createDisplayContent = function() {
   
    this.contentElement = apogeeapp.ui.createElement("div",null,apogeeapp.app.TabComponentDisplay.PARENT_CONTAINER_STYLE);
    this.parentContainer = new apogeeapp.ui.ParentContainer(this.contentElement);

    var workspaceUI = this.component.getWorkspaceUI();

    //add context menu to create childrent
    var parentMember = this.component.getParentMember();
    var app = workspaceUI.getApp();
    app.setFolderContextMenu(this.contentElement,parentMember);

    var children = parentMember.getChildMap();
    for(var childName in children) {
        var child = children[childName];
        var childComponent = workspaceUI.getComponent(child);
        this.addChildComponent(childComponent);
    }
}

//======================================
// Callbacks
// These are defined as static but are called in the objects context
//======================================

/** @protected */
apogeeapp.app.TabComponentDisplay.prototype.destroy = function() {
    var children = this.object.getChildMap();
    var workspaceUI = this.component.getWorkspaceUI();
    
    //TODO THIS LOGIC IS NOT GOOD! FIX IT!
    for(var childName in children) {
        var child = children[childName];
        var childComponent = workspaceUI.getComponent(child);
        childComponent.closeWindowDisplay();
    }
    
    this.closeTab();
}


