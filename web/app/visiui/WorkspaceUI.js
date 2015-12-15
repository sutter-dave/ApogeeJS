/** This class manages the user interface for a workspace object. */
visicomp.app.visiui.WorkspaceUI = function(app,workspace,tab) {
    //properties
	this.app = app;
    this.tab = tab;
    this.controlMap = {};
    this.activeFolderName = null;
    this.workspace = workspace;
	
    this.jsLinkArray = [];
    this.cssLinkArray = [];
    
/////////////////////////////////////////////
var rootFolder = workspace.getRootFolder();
var controlInfo = {};
	controlInfo.object = rootFolder;
    //no ui object!!!
	
    this.controlMap[this.getObjectKey(rootFolder)] = controlInfo;

/////////////////////////////////////////////
	
    //listeners
    var instance = this;
	
	//add folder created listener
    var childDeletedListener = function(objectFullName) {
        instance.childDeleted(objectFullName);
    }
    this.workspace.addListener(visicomp.core.deletechild.CHILD_DELETED_EVENT, childDeletedListener);
}

visicomp.app.visiui.WorkspaceUI.newTableX = 100;
visicomp.app.visiui.WorkspaceUI.newTableY = 50;

visicomp.app.visiui.WorkspaceUI.newTableDeltaX = 50;
visicomp.app.visiui.WorkspaceUI.newTableDeltaY = 50;

/** This method responds to a "new" menu event. */
visicomp.app.visiui.WorkspaceUI.prototype.getWorkspace = function() {
    return this.workspace;
}

/** This method responds to a "new" menu event. */
visicomp.app.visiui.WorkspaceUI.prototype.getChildControl = function(childObject) {
    var key = this.getObjectKey(childObject);
	var controlInfo = this.controlMap[key];
	if(controlInfo) {
		return controlInfo.control;
	}
	else {
		return null;
	}
}

/** This returns the map of control objects. */
visicomp.app.visiui.WorkspaceUI.prototype.getControlMap = function() {
	return this.controlMap;
}
	
/** This method responds to a "new" menu event. */
visicomp.app.visiui.WorkspaceUI.prototype.addControl = function(control) {
    //make sure this is for us
    if(control.getWorkspace() !== this.workspace) return;
	
    var object = control.getObject();
	var parent = object.getParent();
    var controlInfo = this.controlMap[this.getObjectKey(parent)];
	var parentContainer;
	if(controlInfo.control) {
        //the parent control should have a content element (and should be a folder)
        //maybe we need to enforce this its the right tyep and/or add a parent component instead)
		parentContainer = controlInfo.control.getContentElement();
	}
	else {
        //we will assume if there is no control is is the root
		parentContainer = this.tab;
	}
	
	//create the ui object
	var controlFrame = new visicomp.app.visiui.ControlFrame(parentContainer,object.getName());
	control.setFrame(controlFrame);
	
	//store the ui object
	var key = this.getObjectKey(object);
	
	if(this.controlMap[key]) {
		alert("Unknown error - there is already an object with this object key: " + key);
		return;
	}
	
    controlInfo = {};
    controlInfo.object = object;
	controlInfo.control = control;
	
    this.controlMap[key] = controlInfo;
    
    //show the window
	var window = controlFrame.getWindow();
	if(window) {
		window.setPosition(visicomp.app.visiui.WorkspaceUI.newTableX,visicomp.app.visiui.WorkspaceUI.newTableY);
		visicomp.app.visiui.WorkspaceUI.newTableX += visicomp.app.visiui.WorkspaceUI.newTableDeltaX;
		visicomp.app.visiui.WorkspaceUI.newTableY += visicomp.app.visiui.WorkspaceUI.newTableDeltaY;
		window.show();
	}
}

/** This method responds to a "new" menu event. */
visicomp.app.visiui.WorkspaceUI.prototype.childDeleted = function(fullName) {

//we should verify the workspace!
	
	//store the ui object
	var key = fullName;
	
	var controlInfo = this.controlMap[key];
	delete this.controlMap[key];

	if((controlInfo)&&(controlInfo.control)) {
		controlInfo.control.removeFromParent();	
	}
}

visicomp.app.visiui.WorkspaceUI.prototype.getObjectKey = function(object) {
//needs to be changed when we add worksheets
	return object.getFullName();
}

visicomp.app.visiui.WorkspaceUI.prototype.toJson = function() {
    var json = {};
    json.name = this.workspace.getName();
    json.fileType = "visicomp workspace";
    
    json.jsLinks = this.jsLinkArray;
    json.cssLinks = this.cssLinkArray;
	
//we need to wait for these to load!
    
    //controls
    json.data = {};
	this.workspace.getRootFolder().addChildrenToJson(this,json.data);
    
    return json;
}


/** This is used for saving the workspace. */
visicomp.app.visiui.WorkspaceUI.fromJson = function(app, json) {
    var name = json.name;
    var fileType = json.fileType;
	if((fileType !== "visicomp workspace")||(!name)) {
		alert("Error openging file");
		return null;
	}
    
    //add links
// we really need to wait for them to load
    if(json.jsLinks) {
        app.setJsLinks(json.jsLinks);
    }
    if(json.cssLinks) {
        app.setCssLinks(json.cssLinks);
    }
	
//we need to wait for all links to load!!!
    
	//create the workspace
    app.createWorkspace(name);
	var workspace = app.getWorkspace();
	
	//create children
	var rootFolder = workspace.getRootFolder();
	var childrenJson = json.data;
	var updateDataList = [];
	
	rootFolder.createChildrenFromJson(app,childrenJson,updateDataList)
    
    //set the data on all the objects
    var result;
    if(updateDataList.length > 0) {
        result = visicomp.core.updatemember.updateObjects(updateDataList);
            
        if(!result.success) {
            return result;
        }
    }
    
//figure out a better return
	return result;
}

//========================================
// Links
//========================================

visicomp.app.visiui.VisiComp.prototype.getJsLinks = function() {
	return this.jsLinkArray;
}

visicomp.app.visiui.VisiComp.prototype.setJsLinks = function(newLinkArray) {
    //update the page links
    var oldLinkArray = this.jsLinkArray;
	var addList = [];
	var removeList = [];
    this.createLinkAddRemoveList(newLinkArray,oldLinkArray,addList,removeList);
    this.jsLinkArray = newLinkArray;
	this.app.updateWorkspaceLinks(this.workspace.getName(),addList,removeList,"js");;
}

visicomp.app.visiui.VisiComp.prototype.getCssLinks = function() {
	return this.cssLinkArray;
}

visicomp.app.visiui.VisiComp.prototype.setCssLinks = function(newLinkArray) {
    //update the page links
    var oldLinkArray = this.cssLinkArray;
	var addList = [];
	var removeList = [];
    this.createLinkAddRemoveList(newLinkArray,oldLinkArray,addList,removeList);
    this.cssLinkArray = newLinkArray;
	this.app.updateWorkspaceLinks(this.workspace.getName(),addList,removeList,"css");
}

/** This method determins which links are new, which are old and which are removed.  
 * @private */
visicomp.app.visiui.VisiComp.prototype.createLinkAddRemoveList = function(linkArray,oldLinkArray,addList,removeList) { 
    
    var newLinks = {};
    var i;
    var link;
    
    //add the new links
    for(i = 0; i < linkArray.length; i++) {
        link = linkArray[i];
        newLinks[link] = true;
    }
    
    //fiure out which are new and which are outdated
    for(i = 0; i < oldLinkArray.length; i++) {
        link = oldLinkArray[i];
        if(!newLinks[link]) {
			//this link has been removed
            removeList.push(link);
        }
		else {
			//flag that this does not need to be added
			newLinks[link] = false;
		}
    }
	
	//put the new links to the add list
	for(link in newLinks) {
		if(newLinks[link]) {
			addList.push(link);
		}
	}
}

