import {addActionInfo} from "/apogee/actions/action.js";

/** This is self installing command module. It has no exports
 * but it must be imported to install the command. 
 *
 * Action Data format:
 * {
 *  "action": "moveMember",
 *  "member": (member to move),
 *  
 *  "eventInfo": (OUTPUT - event info for the associated delete event)
 * }
 */

/** Move member action function */
function moveMember(model,actionData) {

    let actionResult = {};
    actionResult.actionInfo = ACTION_INFO;
        
    var memberFullName = actionData.memberName;
    var member = model.getMemberByFullName(memberFullName);
    if(!member) {
        actionResult.actionDone = false;
        actionResult.errorMsg = "Member not found for move member";
        return;
    }
    actionResult.member = member;
    
    var targetOwnerFullName = actionData.targetOwnerName;
    var targetOwner = model.getMemberByFullName(targetOwnerFullName);
    if(!targetOwner) {
        actionResult.actionDone = false;
        actionResult.errorMsg = "New parent not found for move member";
        return;
    }
        
    member.move(actionData.targetName,targetOwner);
    actionResult.actionDone = true;
    
    //add the child action results
    let childActionResults = addChildResults(member);
    if(childActionResults) {
        actionResult.childActionResults = childActionResults;
    }
    
    return actionResult;
}

function addChildResults(member) {
    let childActionResults = [];
    
    if(member.isParent) {    
        var childMap = member.getChildMap();
        for(var childName in childMap) {
            var child = childMap[childName];
            let childActionResult = {};
            childActionResult.actionDone = true;
            childActionResult.member = child;
            childActionResult.actionInfo = ACTION_INFO;
            
            childActionResults.push(childActionResult);
            
            //add results for children to this member
            grandchildActionResults = addChildResults(child);
            if(grandchildActionResults) {
                childActionResult.childActionResults = grandchildActionResults;
            }
        }
    }
    else if(member.isRootHolder) {
        var root = member.getRoot();
        let childActionResult = {};
        childActionResult.actionDone = true;
        childActionResult.member = root;
        childActionResult.actionInfo = ACTION_INFO;

        childActionResults.push(childActionResult);
        
        //add results for children to this member
        grandchildActionResults = addChildResults(child);
        if(grandchildActionResults) {
            childActionResult.childActionResults = grandchildActionResults;
        }
    }

    if(childActionResults.length > 0) {
        return childActionResults;
    }
    else {
        return null;
    }
}


/** Action info */
let ACTION_INFO = {
    "action": "moveMember",
    "actionFunction": moveMember,
    "checkUpdateAll": true,
    "updateDependencies": true,
    "addToRecalc": true,
    "event": "memberUpdated"
};


//This line of code registers the action 
addActionInfo(ACTION_INFO);