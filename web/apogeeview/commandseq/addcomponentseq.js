import apogeeutil from "/apogeeutil/apogeeUtilLib.js";
import {validateTableName} from "/apogee/apogeeCoreLib.js"; 

import {getPropertiesDialogLayout} from "/apogeeview/commandseq/updatecomponentseq.js";
import Component from "/apogeeapp/component/Component.js";
import {showConfigurableDialog} from "/apogeeview/dialogs/ConfigurableDialog.js";
import {showSelectComponentDialog} from "/apogeeview/dialogs/SelectControlDialog.js";

//=====================================
// UI Entry Point
//=====================================

/** This functions initiates the add component action. It will create a dialog for the user to enter the relevent 
 * properties, with the values optionalInitialProperties preset. The created componenent will also use the 
 * property values in optionalBaseComponentValues, overridden by the user input properties where applicable. The member
 * created will be made using the optionalBaseMemberValues, agagin overidden by any user input values.  */   
//piggybackCommand is a temporary test!!!
export function addComponent(appView,app,componentClass,optionalInitialProperties,optionalBaseMemberValues,optionalBaseComponentValues) {

        let componentViewClass = appView.constructor.getComponentViewClass(componentClass.uniqueName);
        let modelView = appView.getWorkspaceView().getModelView();

        //get the active workspace
        var workspaceManager = app.getWorkspaceManager();
        if(!workspaceManager) {
            alert("There is no open workspace.");
            return;
        }     

        var modelManager = workspaceManager.getModelManager();
        if(!modelManager) {
            alert("The workspace has not been loaded yet.");
            return;
        }    

        //this is not a true test - the workspace and model can be presenet ith out the model loaded.

        
        //get the tyep display name
        var displayName = componentClass.displayName
        
        //get any additional property content for dialog beyond basic properties
        var additionalLines = apogeeutil.jsonCopy(componentViewClass.propertyDialogLines); 
        
        //get the folder list
        var folderList = modelManager.getFolders();
        
        //create the dialog layout - do on the fly because folder list changes
        var dialogLayout = getPropertiesDialogLayout(displayName,folderList,additionalLines,true,optionalInitialProperties);

        //we will populate the parent if we need to insert thenew component as a child in the parent document. 
        
        
        //create on submit callback
        var onSubmitFunction = function(userInputProperties) {
            
            //validate the name
            var nameResult = validateTableName(userInputProperties.name);
            if(!nameResult.valid) {
                alert(nameResult.errorMessage);
                return false;
            }

            //other validation of inputs?

            let commands = [];
            
            //create the model command
            let createCommandData = {};
            createCommandData.type = "addComponent";
            createCommandData.parentFullName = userInputProperties.parentName;
            createCommandData.memberJson = Component.createMemberJson(componentClass,userInputProperties,optionalBaseMemberValues);
            createCommandData.componentJson = Component.createComponentJson(componentClass,userInputProperties,optionalBaseComponentValues);

            //editor related commands
            let additionalCommands;
            let parentComponentView;
            if(componentViewClass.hasChildEntry) {
                parentComponentView = getComponentFromName(modelManager,modelView,userInputProperties.parentName);
                additionalCommands = getAdditionalCommands(parentComponentView,userInputProperties.name);

                //added the editor setup command
                if(additionalCommands.editorSetupCommand) commands.push(additionalCommands.editorSetupCommand);

                //add any delete commands
                if(additionalCommands.deletedComponentCommands){
                    //make sure the user wants to proceed
                    let deletedComponentNames = additionalCommands.deletedComponentCommands.map(command => command.memberFullName);
                    let doDelete = confirm("Are you sure you want to delete these apogee nodes: " + deletedComponentNames);
                    
                    //return if user rejects
                    if(!doDelete) return;

                    commands.push(...additionalCommands.deletedComponentCommands);
                } 
            }

            //store create command
            commands.push(createCommandData);

            //add the editor insert command
            if((additionalCommands)&&(additionalCommands.editorAddCommand)) {
                commands.push(additionalCommands.editorAddCommand);
            }
            
            let commandData;
            if(commands.length > 1) {
                commandData = {};
                commandData.type = "compoundCommand";
                commandData.childCommands = commands;
            }
            else if(commands.length === 1) {
                commandData = commands[0];
            }
            else {
                //this shouldn't happen
                return;
            }
            
            //execute command
            app.executeCommand(commandData);

            //give focus back to editor
            if(componentViewClass.hasChildEntry) {
                parentComponentView.giveEditorFocusIfShowing();
            }

            //return true to close the dialog
            return true;
        }

        //give foxus back to editor
        let onCancelFunction = () => null; /*parentComponentView.giveEditorFocusIfShowing() - oops no parent component*/;
        
        //show dialog
        showConfigurableDialog(dialogLayout,onSubmitFunction,onCancelFunction);
}


/** This gets a callback to add an "additional" component, menaing one that is not
 * in the main component menu. */
export function addAdditionalComponent(appView,app,optionalInitialProperties,optionalBaseMemberValues,optionalBaseComponentValues) {
        
    var onSelect = function(componentUniqueName) {
        let componentClass = app.getComponentClass(componentUniqueName);
        if(componentClass) {
            addComponent(appView,app,componentClass,optionalInitialProperties,optionalBaseMemberValues,optionalBaseComponentValues);
        }
        else {
            alert("Unknown component type: " + componentType);
        }
    }
    //get the display names
    let additionalComponents = app.getAdditionalComponentNames();
    let componentInfoList = additionalComponents.map( componentName => {
        let componentClass = app.getComponentClass(componentUniqueName); 
        return {displayName: componentClass.displayName, uniqueName: componentName};
    });
    //open select component dialog
    showSelectComponentDialog(componentInfoList,onSelect);
}

function getAdditionalCommands(parentComponentView,childName) {

    //check selection
    let useParentSelection = getUseParentSelection(parentComponentView);
    
    let insertAtEnd = !useParentSelection;

    return parentComponentView.getInsertApogeeNodeOnPageCommands(childName,insertAtEnd);
}

function getComponentFromName(modelManager, modelView, componentName) {
    var model = modelManager.getModel();
    var member = model.getMemberByFullName(componentName);
    var componentView = modelView.getComponentView(member.getId());
    return componentView;
}

function getUseParentSelection(parentComponentView) {
    //use the parent selection only if the tab is the active tab
    //otherwise the component should be placed at the end

    let tabDisplay = parentComponentView.getTabDisplay();
    if(!tabDisplay) return false;

    let tab = tabDisplay.getTab();
    if(!tab) return false;
    
    return tabDisplay.getIsShowing();
}
