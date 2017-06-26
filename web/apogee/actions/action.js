/**
 * Action Namespace
 * An action is an operation on the data model. The code in this namespace handles
 * the generic parts of the action process, and the action specific code is placed
 * elsewhere.
 * 
 * Generic Action:
 * - The action is represented by a data object "actionData". 
 * - The method apogee.action.doAction is called to exectue the action.
 * - Available actions are registered through the method apogee.action.addActionInfo.
 *   this allows the doAction method to dispatch the actionData to the proper
 *   action specific code.
 * - After the action specific code is completed, generic code runs to ensure eny
 *   remote tables that need to be updated do get updated, and that the proper
 *   events are fired.
 *   
 * Registering a specific action:
 * To register a specific action, apogee.action.addActionInfo must be called with 
 * a actionInfo object. An action info object is of the following format.
 * actionInfo object: {
 *   "actionFunction": (funtion to exectue object - arguments = actionData,processedActions),
 *   "checkUpdateAll": (boolean - indicates if change in the underlying data model),
 *   "updateDependencies": [Indicates the changed object requires its dependecies be updated),
 *   "addToRecalc": (Indicates the changed object should be added to the recalc list, with its dependencies),
 *   "addDependenceiesToRecalc": (Indicates the changed object should have its dependencies be added to the recalc list, but not itself),
 *   "event": (The name of the event to fire for this object and action.)
 * }
 * 
 * Action Data Format:
 * The action data is used to pass data into the action specific code, and alse to 
 * pass data back from the action specific code. Format:
 * actionData format: {
 *   "action": (The name of the action to execute),
 *   "member": (The data object that is acted upon , if applicable),
 *   (other, multiple): (Specific data for the action),
 *   "error": (output only - An action error giving an error in action specific code execution)
 *   "actionInfo": (This is the action info for the action. It is added within doAction and should not be added the user.)
 * }
 * 
 * Action Function:
 * The action function executes the action specific code. It is passed the actionData object
 * and an array "processedActions.". The actions must add any executed actions to the action
 * list. This is done in the action function as opposed to outside because the action
 * function may exectue multiple actions, such as deleting multiple objects.
 * 
 * 
 */ 
apogee.action = {};

/** This structure holds the processing information for all the actions. It is set by each action. 
 * @private */
apogee.action.actionInfo = {
}

/** This method is used to execute an action for the data model. 
 * The optionalContext is a context manager to convert a member name to a
 * member, if supported by the action.
 * The optionalActionResponse allows you to pass an existing actionResponse rather
 * than creating a new one inside this function as a return value. */
apogee.action.doAction = function(actionData,optionalContext,optionalActionResponse) {
    
    //read the workspace
    var workspace;
    if(actionData.member) {
        workspace = actionData.member.getWorkspace();
    }
    else if(actionData.workspace) {
        workspace = actionData.workspace;
    }
    else {
        throw new Error("Workspace info missing from action. ");
    }
    
    //only allow one action at a time
    if(workspace.isActionInProgress()) {
        var queuedAction = {};
        queuedAction.actionData = actionData;
        queuedAction.optionalContext = optionalContext;
        queuedAction.optionalActionResponse = optionalActionResponse;
        workspace.queueAction(queueAction);
        
        //return an empty (successful) action response
        //we sould have a flag saying the action is pending
        return new apogee.ActionResponse();;
    }
    
    //flag action in progress
    workspace.setActionInProgress(true);
    
    var actionResponse = optionalActionResponse ? optionalActionResponse : new apogee.ActionResponse();
    
    try {   
        
        var processedActions = [];
        
        //do the action
        apogee.action.callActionFunction(actionData,optionalContext,processedActions); 
        
        //finish processing the action
        var recalculateList = [];
        
        apogee.action.updateDependencies(workspace,processedActions,recalculateList);
        
        apogee.action.updateRecalculateList(processedActions,recalculateList);
        
        apogee.calculation.callRecalculateList(recalculateList,actionResponse);
    
        apogee.action.fireEvents(workspace,processedActions,recalculateList);
	}
	catch(error) {
        //unknown application error
        var actionError = apogee.ActionError.processException(error,"AppException",true);
        actionResponse.addError(actionError);
    }
    
    //flag action in progress
    workspace.setActionInProgress(false);
    
    //trigger any pending actions
    var queuedActionData = workspace.getQueuedAction();
    if(queuedActionData) {
        apogee.action.asynchRunQueuedAction(queuedActionData);
    }
    
    //return response
	return actionResponse;
}

/** This function is used to register an action. */
apogee.action.addActionInfo = function(actionName,actionInfo) {
    apogee.action.actionInfo[actionName] = actionInfo;
}

/** This function looks up the proper function for an action and executes it. */
apogee.action.callActionFunction = function(actionData,context,processedActions) {

    //do the action
    var actionInfo = apogee.action.actionInfo[actionData.action];
    if(actionInfo) {
        actionData.actionInfo = actionInfo;
        actionInfo.actionFunction(actionData,context,processedActions);
    }
    else {
        actionData.error = new apogee.ActionError("Unknown action: " + actionData.action,"AppException",null);
    }  
}

/** This is a convenience method to set a member to a given value when the dataPromise resolves. */
apogee.action.asynchDataUpdate = function(memberName,context,dataPromise) {
    
    var token = apogee.action.getAsynchToken();
        
    var actionData = {};
    actionData.action = "updateDataPending";
    actionData.memberName = memberName;
    actionData.token = token;
    var actionResponse =  apogee.action.doAction(actionData,context);
    
    var asynchCallback = function(memberValue) {
        //set the data for the table, along with triggering updates on dependent tables.
        var actionData = {};
        actionData.action = "updateData";
        actionData.memberName = memberName;
        actionData.token = token;
        actionData.data = memberValue;
        var actionResponse =  apogee.action.doAction(actionData,context);
    }
    var asynchErrorCallback = function(errorMsg) {
        var actionData = {};
        actionData.action = "updateError";
        actionData.member = member;
        actionData.token = token;
        actionData.errorMsg = errorMsg;
        var actionResponse =  apogee.action.doAction(actionData,context);
    }

    //call appropriate action when the promise resolves.
    dataPromise.then(asynchCallback).catch(asynchErrorCallback);
}

/** This method returns a random numberic token that is used in asynch updates.
 * It serves two purposes, first to ensure only the _latest_ asyhc update is 
 * done. Secondly it prevents someone arbitrarily using this method 
 * without initially setting the pending flag.
 */
apogee.action.getAsynchToken = function() {
    return Math.random();
}

/** This token value should be used if a table is pending because it is waiting for
 * an update in another table. */
apogee.action.DEPENDENT_PENDING_TOKEN = -1;

//=======================================
// Internal Methods
//=======================================

/** This function triggers the action for the queued action to be run when the current thread exits. */
apogee.action.asynchRunQueuedAction = function(queuedActionData) {
    var callback = function() {
        apogee.action.doAction(queuedActionData.actionData,
            queuedActionData.optionalContext,
            queuedActionData.optionalActionResponse);
    }
    
    setTimeout(callback,0);
}

/** This method makes sure the member dependencies in the workspace are properly updated. */
apogee.action.updateDependencies = function(workspace,processedActions,recalculateList) {
    //check if we need to update the entire model
    var updateAllDep = apogee.action.checkUpdateAllDep(processedActions);
    if(updateAllDep) {
        //update entire model - see conditions bewlo
        workspace.updateDependeciesForModelChange(recalculateList);
    }
    else {
        //upate dependencies on table with updated code
        for(var i = 0; i < processedActions.length; i++) {
            var actionData = processedActions[i];
            if(apogee.action.doInitializeDependencies(actionData)) {
                actionData.member.initializeDependencies();
            }
        }
    }
}
    
/** This function updates the recalculation list for the given processed actions. */
apogee.action.updateRecalculateList = function(processedActions,recalculateList) {
    for(var i = 0; i < processedActions.length; i++) {
        var actionData = processedActions[i];
        if(apogee.action.doAddToRecalc(actionData)) {
            apogee.calculation.addToRecalculateList(recalculateList,actionData.member);            
        }
        else if((apogee.action.doAddDependOnToRecalc(actionData))) {
            apogee.calculation.addDependsOnToRecalculateList(recalculateList,actionData.member);                         
        }
    }
}
    
/** This function fires the proper events for the action. */
apogee.action.fireEvents = function(workspace,processedActions,recalculateList) {
    
    //TEMPORARY EVENT PROCESSING - NEEDS TO BE IMPROVED
    var eventSet = {};
    var member;
    
    for(var i = 0; i < processedActions.length; i++) {
        var actionData = processedActions[i];
        
        if(actionData.actionInfo) {
            var eventName = actionData.actionInfo.event;
            if(!eventName) continue;
            
            var member = actionData.member;
      
            apogee.action.fireEvent(workspace,eventName,member);

            //temporary processing!
            if(member) {
                eventSet[actionData.member.getId()] = true;
            }
        }
    }
    
    //Doh! WE NEED TO DO THIS DIFFERENTLY FOR LOTS OF REASONS
    for(i = 0; i < recalculateList.length; i++) {
        var member = recalculateList[i];
        if(!eventSet[member.getId()]) {
            apogee.action.fireEvent(workspace,apogee.updatemember.MEMBER_UPDATED_EVENT,member);
        }
    } 
}

/** This is a helper function to dispatch an event. */
apogee.action.fireEvent = function(workspace,name,data) {
    workspace.dispatchEvent(name,data);
}

/** This method determines if updating all dependencies is necessary. */
apogee.action.checkUpdateAllDep = function(processedActions) {
    for(var i = 0; i < processedActions.length; i++) {
        var actionData = processedActions[i];
        var member = actionData.member;
        //check update only needed for data holders (no impact for non-data holder
        if((member)&&(member.isDataHolder)) {
            if((actionData.actionInfo)&&(actionData.actionInfo.checkUpdateAll)){
                return true;
            }
        }
    }
    return false;
}

/** This method if a single action entry requires updating dependencies for the associated member. */
apogee.action.doInitializeDependencies = function(actionData) {
    if(actionData.actionInfo) {
        return actionData.actionInfo.updateDependencies;
    }
    else {
        return false;
    }
}

/** This method checks if the associated member and its dependencies need to be added to the recalc list. */
apogee.action.doAddToRecalc = function(actionData) {
    if(actionData.actionInfo) {
        return actionData.actionInfo.addToRecalc;
    }
    else {
        return false;
    }
}

/** This method checks if the dependencies of the associated needs to be added to the recalc list, but not the member itself. */
apogee.action.doAddDependOnToRecalc = function(actionData) {
    if(actionData.actionInfo) {
        return actionData.actionInfo.addDependenceiesToRecalc;
    }
    else {
        return false;
    }
}

