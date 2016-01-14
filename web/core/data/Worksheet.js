/** This is a worksheet, which is basically a function
 * that is expanded into data objects. */
visicomp.core.Worksheet = function(parent,name) {
    //base init
    visicomp.core.Impactor.init.call(this);
    visicomp.core.Child.init.call(this,parent,name,visicomp.core.Worksheet.generator);
    visicomp.core.DataHolder.init.call(this);
    visicomp.core.Dependant.init.call(this);
    visicomp.core.Recalculable.init.call(this);
    
    //create the internal folder as a root folder (no parent). But give it
    //the full path name
    this.internalFolder = new visicomp.core.Folder(this,this.getFullName());
    
    this.returnValueString = "";
    this.argList = [];
    
    //this is the internal workspace in which function evaluations are done.
    this.virtualWorkspace = null;
    
    //dummy, until we figure out how to do this
    var worksheetFunction = this.getWorksheetFunction();
    this.setData(worksheetFunction);
    
    //subscribe to the update event for this table
    //add a member updated listener
    instance = this;
    var memberUpdatedCallback = function(member) {
        if(instance.isBaseReturnObject(member)) {
            this.virtualWorkspace = null;
        }    
    }
    this.getWorkspace().addListener(visicomp.core.updatemember.MEMEBER_UPDATED_EVENT, memberUpdatedCallback);
}

//add components to this class
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.Child);

//add components to this class
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.Child);
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.DataHolder);
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.Dependant);
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.Impactor);
visicomp.core.util.mixin(visicomp.core.Worksheet,visicomp.core.Recalculable);

/** */
visicomp.core.Worksheet.prototype.getInternalFolder = function() {
    return this.internalFolder;
}

// SET REUTRN VALUE NEEDS TO HAVE THE FULL UPDATE LOGIC!!!!

/** */
visicomp.core.Worksheet.prototype.setReturnValueString = function(returnValueString) {
    
    this.returnValueString = returnValueString;
    
    //clear the virtual workspace
    this.virtualWorkspace = null;
    
    this.triggerRecalc();
}

/** */
visicomp.core.Worksheet.prototype.getReturnValueString = function() {
    return this.returnValueString;
}

/** */
visicomp.core.Worksheet.prototype.setArgList = function(argList) {
    this.argList = argList;
    
    //clear the virtual workspace
    this.virtualWorkspace = null;
    
    this.triggerRecalc();
}

/** */
visicomp.core.Worksheet.prototype.getArgList = function() {
    return this.argList;
}

/** This method is called when the child is deleted. If necessary the implementation
 * can extend this function, but it should call this base version of the function
 * if it does.  */
visicomp.core.Worksheet.prototype.onDelete = function() {
    
    var returnValue;
    
    if(this.internalFolder) {
        returnValue = visicomp.core.deletechild.deleteChild(this.internalFolder);
    }
    
//I don't know what to do if this fails. Figure that out.
    
    //call the base delete
    returnValue = visicomp.core.Child.onDelete.call(this);
	return returnValue;
}

/** This method creates a child from a json. It should be implemented as a static
 * method in a non-abstract class. */ 
visicomp.core.Worksheet.fromJson = function(parent,json,updateDataList) {
    var worksheet = new visicomp.core.Worksheet(parent,json.name);
    if(json.argList !== undefined) {
        worksheet.setArgList(json.argList);
    }
    if(json.returnValue !== undefined) {
        worksheet.setReturnValueString(json.returnValue);
    }
    
    //recreate the root folder if info is specified
    if(json.internalFolder) {
        worksheet.internalFolder = visicomp.core.Folder.fromJson(worksheet,json.internalFolder,updateDataList);
    }
    
    return worksheet;

}

//===================================
// Protected Functions
//===================================

/** This method adds any additional data to the json saved for this child. 
 * @protected */
visicomp.core.Worksheet.prototype.addToJson = function(json) {
    json.argList = this.argList;
    json.returnValue = this.returnValueString;
    json.internalFolder = this.internalFolder.toJson();
}

/** This method indicates if the member needs to be calculated.
 * It should be implemented in inheriting objects. 
 * */
visicomp.core.Worksheet.prototype.needsExecuting = function() {return false;}


/** This method updates an object after its dependencies have been updated.
 * It should be implemented by inheriting objects.  */
visicomp.core.Worksheet.prototype.execute = function() {}
    
    
//==============================
// Private Methods
//==============================

/** This method creates the worksheet function.  */
visicomp.core.Worksheet.prototype.triggerRecalc = function() {
    var recalculateList = [];
    visicomp.core.calculation.addToRecalculateList(recalculateList,this);
    
    var dummyEditStatus = {};
    visicomp.core.updatemember.doRecalculate(recalculateList,dummyEditStatus);
    //handle edit status differently----------------
    if(!dummyEditStatus.success) {
        alert("Error in recal from worksheet.");
    }
    //---------------------------------------
}



/** This method creates the worksheet function.  */
visicomp.core.Worksheet.prototype.getWorksheetFunction = function() {
    var instance = this;
    
    var worksheetFunction = function(args) {
        
        //if the virtual workspace does not exist, create it
        var virtualWorkspace = instance.getVirtualWorkspace();
        
        //lookup elements from virtual workspace
        var rootFolder = virtualWorkspace.getRootFolder();
        
        //get the input elements
        var inputElementArray = instance.loadInputElements(rootFolder);
        
        //create update array
        var updateDataList = [];
        for(var i = 0; i < inputElementArray.length; i++) {
            var entry = {};
            entry.member = inputElementArray[i];
            entry.data = arguments[i];
            updateDataList.push(entry);
        }
        
        //do the update
        var returnStatus = visicomp.core.updatemember.updateObjects(updateDataList);
        
        if(returnStatus.success) {
            //retrieve the result
            return instance.loadOutputElement(rootFolder);
        }
        else {
            //error!
            throw visicomp.core.util.createError(returnStatus.msg);
        }
    }
    
    return worksheetFunction;
    
    
}

/** This method creates the worksheet function.  */
visicomp.core.Worksheet.prototype.getVirtualWorkspace = function() {
    if(!this.virtualWorkspace) {
        var json = this.internalFolder.toJson();
        var tempWorkspace = new visicomp.core.Workspace("temp");
        var updateDataList = [];
        var tempRootFolder = visicomp.core.Folder.fromJson(tempWorkspace,json,updateDataList);
        tempWorkspace.rootFolder = tempRootFolder;
        visicomp.core.updatemember.updateObjects(updateDataList);
        
        this.virtualWorkspace = tempWorkspace;
    }
    
    return this.virtualWorkspace;
}

/** This method loads the input argument members from the virtual workspace.  */
visicomp.core.Worksheet.prototype.loadInputElements = function(rootFolder) {
    var argMembers = [];
    for(var i = 0; i < this.argList.length; i++) {
        var argName = this.argList[i];
        var argMember = rootFolder.lookupChildFromPath(argName);
        argMembers.push(argMember);
    }
    return argMembers;
}

/** This method gets the output member from the virtual workspace.  */
visicomp.core.Worksheet.prototype.loadOutputElement = function(rootFolder) {
    if((this.returnValueString != null)&&(this.returnValueString.length > 0)) {
        var member = rootFolder.lookupChildFromPath(this.returnValueString);
        return member.getData();
    }
    else {
        return undefined;
    }
}

/** This method gets the output member from the virtual workspace.  */
visicomp.core.Worksheet.prototype.isBaseReturnObject = function(member) {
    if(member.getRootFolder() == this.internalFolder) {
        //for now just clear the virtual workspace if anything in the worksheet changes.
        //we should be able to make this more efficient
       this.virtualWorkspace = null;
       this.triggerRecalc();
    }
}

//============================
// Static methods
//============================

visicomp.core.Worksheet.generator = {};
visicomp.core.Worksheet.generator.displayName = "Worksheet";
visicomp.core.Worksheet.generator.type = "visicomp.core.Worksheet";
visicomp.core.Worksheet.generator.createMember = visicomp.core.Worksheet.fromJson;

//register this member
visicomp.core.Workspace.addMemberGenerator(visicomp.core.Worksheet.generator);