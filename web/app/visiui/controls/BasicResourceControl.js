/** This is a mixin that encapsulates the base functionality of an abstract resource control
 * 
 * This is not a class, but it is used for the prototype of the objects that inherit from it.
 */
visicomp.app.visiui.BasicResourceControl = {};

/** This is the initializer for the component. The object passed is the core object
 * associated with this control. */
visicomp.app.visiui.BasicResourceControl.init = function() {}

//==============================
// Public Instance Methods
//==============================

/** This serializes the table control. */
visicomp.app.visiui.BasicResourceControl.toJson = function() {
    var json = {};
    json.name = this.reosource.getName();
    json.type = visicomp.app.visiui.TableControl.generator.uniqueName;
    
    //store the processor info
	var resourceProcessor = this.getObject().getResourceProcessor();
    json.processor = resourceProcessor.updateToJson();
		
    //store the codeable info
	json.functionBody = this.resource.getFunctionBody();
	json.supplementalCode = this.resource.getSupplementalCode();

    return json;
}

//==============================
// Private Instance Methods
//==============================


/** This method populates the frame for this control. */
visicomp.app.visiui.BasicResourceControl.populateFrame = function(controlFrame) {
    
    var window = controlFrame.getWindow();
	
	//set the child UI object onto the control engine
    var resource = this.getObject();
    resource.getResourceProcessor().setWindow(window);
	
    //create the menu
    var menuItemInfoList = this.getMenuItemInfoList();
  
    var itemInfo = {};
    itemInfo.title = "Edit&nbsp;Initializer&nbsp;Code";
    itemInfo.callback = this.createEditCodeableDialogCallback(itemInfo.title);
    
    //add these at the start of the menu
    menuItemInfoList.splice(0,0,itemInfo);

    //dummy size
window.setSize(200,200);

    //check if the implementation wants to do anything
    if(this.addToFrame) {
        this.addToFrame(controlFrame);
    }

}

//======================================
// Static methods
//======================================

/** This method can be called to complete serialization of a basic control. */
visicomp.app.visiui.BasicResourceControl.updatefromJson = function(json,updateDataList) {
		var resourceProcessor = resource.getResourceProcessor();
		resourceProcessor.updateFromJson(json.processor);
		
        var updateData = {};
        updateData.member = resource;
		updateData.functionBody = json.functionBody;
		updateData.supplementalCode = json.supplementalCode;
        updateDataList.push(updateData);
}
