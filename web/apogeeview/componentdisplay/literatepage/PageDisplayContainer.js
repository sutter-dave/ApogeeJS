import {getSaveBar} from "/apogeeview/componentdisplay/toolbar.js";
import DATA_DISPLAY_CONSTANTS from "/apogeeview/datadisplay/dataDisplayConstants.js";
import apogeeui from "/apogeeui/apogeeui.js";

/** This is a standin for the display conatiner for the literate page
 * 
 * @class 
 */
export default class PageDisplayContainer {

    constructor(component, viewType, isMainView) {
        
        //variables
        this.isMainView = isMainView;
        
        this.mainElement = null;
        this.viewLabelHeaderElement = null;
        this.viewLabelElement = null;
        this.headerContainer = null;
        this.viewContainer = null;

        this.viewSelectorContainer = null;
        this.viewActiveElement = null;
        this.viewNameElement = null;

        this.uiCompleted = false;
        
        this.isComponentShowing = false;
        this.isViewActive = isMainView;
        this.isContentLoaded = false;
        
        this.destroyViewOnInactive = true;
        
        this.inEditMode = false;
        
        this.content = null;
        
        this.component = component;
        this.viewType = viewType;
        this.dataDisplay = null;

        this.heightUiActive = false;
        this.showLessButton = null;
        this.showMoreButton = null;
        this.showMaxButton = null;

        this.savedUiState = {};
        
        //initialize
        this.initUI();
    }

    getComponent() {
        return this.component;
    }

    //-------------------
    // state management
    //-------------------

    /** This method should be called whent the frame parent is loaded or unloaded from the DOM. */
    setIsComponentShowing(isComponentShowing) {
        this.isComponentShowing = isComponentShowing;
        this.updateDataDisplayLoadedState();
    }

    /** This returns the isComponentShowing status of the display. */
    getIsComponentShowing() {
        return this.isComponentShowing;
    }

    /** This method should be called whent the frame parent is loaded or unloaded from the DOM. */
    setIsViewActive(isViewActive) {
        this.isViewActive = isViewActive;
        this.updateViewSelectorState();
        this.updateDataDisplayLoadedState();
    }

    /** This method closes the window. If the argument forceClose is not
     * set to true the "request_close" handler is called to check if
     * it is ok to close the window. */
    close(forceClose) {

        if(!forceClose) {
            //make a close request
            var requestResponse = this.callHandler(apogeeui.REQUEST_CLOSE,this);
            if(requestResponse == apogeeui.DENY_CLOSE) {
                //do not close the window
                return;
            }
        }

        this.dispatchEvent(apogeeui.CLOSE_EVENT,this);
    }

    getStateJson() {
        //update the saved state json
        this.savedUiState.isViewActive = this.isViewActive;
        if(this.dataDisplay) {
            this.dataDisplay.addUiStateData(this.savedUiState);
        }
        return this.savedUiState;
    }

    setStateJson(json) {
        if(json) {
            this.savedUiState = json;
        }
        else {
            this.savedUiState = {};
        }

        //update any relevent fields
        if(this.savedUiState.isViewActive !== undefined) {
            this.setIsViewActive(this.savedUiState.isViewActive);
        }

        if(this.dataDisplay) {
            this.dataDisplay.readUiStateJson(this.savedUiState);
        }
    }

    //---------------------------
    // GUI ELEMENT
    //---------------------------

    /** This method returns the view label element to be used in the component title bar. */
    getViewSelectorContainer() {
        return this.viewSelectorContainer;
    }

    /** This method returns the main dom element for the window frame. */
    getDisplayElement() {
        return this.mainElement;
    }

    //====================================
    // Initialization Methods
    //====================================

    /** @private */
    initUI() {
        
        //make the container
        this.mainElement = apogeeui.createElementWithClass("div","visiui_displayContainer_mainClass",null);

        //make the selector for the view, in the component title bar
        this.viewSelectorContainer = apogeeui.createElementWithClass("div","visiui_displayContainer_viewSelectorContainerClass",null);

        this.viewActiveElement = apogeeui.createElementWithClass("div","visiui_displayContainer_viewActiveElementClass",this.viewSelectorContainer);
        this.viewNameElement = apogeeui.createElementWithClass("div","visiui_displayContainer_viewSelectorClass",this.viewSelectorContainer);
        
        this.viewNameElement.innerHTML = this.viewType;

        this.expandImage = apogeeui.createElementWithClass("img","visiui_displayContainer_expandContractClass",this.viewActiveElement);
        this.expandImage.src = apogeeui.getResourcePath(PageDisplayContainer.COMPONENT_LABEL_EXPAND_BUTTON_PATH);
    
        this.contractImage = apogeeui.createElementWithClass("img","visiui_displayContainer_expandContractClass",this.viewActiveElement);
        this.contractImage.src = apogeeui.getResourcePath(PageDisplayContainer.VIEW_TITLE_CONTRACT_BUTTON_PATH);

        this.viewSelectorContainer.onclick = () => this.setIsViewActive(!this.isViewActive);
        
        this.updateViewSelectorState();
    }

    /** This completes the UI. It should only be called when the data display has been created. */
    completeUI() {

        if(!this.dataDisplay) return;
        
        //make the label for the view
        this.viewLabelHeaderElement = apogeeui.createElementWithClass("div","visiui_displayContainer_viewLabelHeaderClass",this.mainElement);

        this.viewLabelElement = apogeeui.createElementWithClass("div","visiui_displayContainer_viewLabelClass",this.viewLabelHeaderElement);
        this.viewLabelElement.innerHTML = this.viewType;

        this.viewToolbarElement = apogeeui.createElementWithClass("div","visiui_displayContainer_viewToolbarClass",this.viewLabelHeaderElement);

        //add the view toolbar controls
        this.populateViewToolbar();
        
        //add the header elment (for the save bar)
        this.headerContainer = apogeeui.createElementWithClass("div","visiui_displayContainer_headerContainerClass",this.mainElement);
        
        //add the view container
        let viewContainerClass = this.dataDisplay.getSupressContainerHorizontalScroll() ? 
            "visiui_displayContainer_viewContainerClass_noHScroll" : "visiui_displayContainer_viewContainerClass";
        this.viewContainer = apogeeui.createElementWithClass("div",viewContainerClass,this.mainElement);

        this.uiCompleted = true;
    }

    /** This undoes the data display specific parts of the container ui */
    uncompleteUI() {
        apogeeui.removeAllChildren(this.mainElement);
        this.heightUiActive = false;
        this.uiCompleted = false;
    }

    updateViewSelectorState() {
        //show/hide ui elements
        if(this.isViewActive) {
            this.mainElement.style.display = ""; 
            this.expandImage.style.display = "none";
            this.contractImage.style.display = "";
        }
        else {
            this.mainElement.style.display = "none";
            this.expandImage.style.display = "";
            this.contractImage.style.display = "none";
        }
    }

    /** This method configures the toolbar for the view display. */
    populateViewToolbar() {
        if(this.dataDisplay.getUseContainerHeightUi()) {
            this.showLessButton = apogeeui.createElementWithClass("div","visiui_displayContainer_viewDisplaySizeButtonClass",this.viewToolbarElement);
            this.showLessButton.innerHTML = "less";
            this.showLessButton.onclick = () => this.showLess();
            this.showMoreButton = apogeeui.createElementWithClass("div","visiui_displayContainer_viewDisplaySizeButtonClass",this.viewToolbarElement);
            this.showMoreButton.innerHTML = "more";
            this.showMoreButton.onclick = () => this.showMore();
            this.showMaxButton = apogeeui.createElementWithClass("div","visiui_displayContainer_viewDisplaySizeButtonClass",this.viewToolbarElement);
            this.showMaxButton.innerHTML = "max";
            this.showMaxButton.onclick = () => this.showMax();
            this.heightUiActive = true;
            this.updateViewSizeButtons()
        }
    }

    showLess() {
        if((this.dataDisplay)&&(this.heightUiActive)) {
            if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_MAX) {
                //if we are in display max mode, change to display some mode
                this.dataDisplay.setResizeHeightMode(DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_SOME);
            }
            else if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_SOME) {
                //if we are in "some" mode, adjust size smaller if allowed
                if((this.dataDisplay.getHeightAdjustFlags() | DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_LESS) !== 0) {                  
                    this.dataDisplay.adjustHeight(DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_LESS);
                }
            }
            else {
                //unknown mode
                return;
            }
            this.updateViewSizeButtons();
        }
    }

    showMore() {
        if((this.dataDisplay)&&(this.heightUiActive)) {
            if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_SOME) {
                //if we are in "some" mode, adjust size smaller if allowed
                if((this.dataDisplay.getHeightAdjustFlags() | DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MORE) !== 0) {
                    this.dataDisplay.adjustHeight(DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MORE);
                }
            }
            else {
                //no action is not in some mode
                return;
            }
            this.updateViewSizeButtons();
        }
    }

    showMax() {
        if((this.dataDisplay)&&(this.heightUiActive)) {
            if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_SOME) {
                //if we are in display max mode, change to display some mode
                this.dataDisplay.setResizeHeightMode(DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_MAX);
            }
            else {
                //no action is not in some mode
                return;
            }
            this.updateViewSizeButtons();
        }
    }

    updateViewSizeButtons() {
        if(this.heightUiActive) {
            let showLessVisible = false, showMoreVisible = false, showMaxVisible = false;
            if(this.dataDisplay) {
                if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_SOME) {
                    showLessVisible = true;
                    showMoreVisible = true;
                    showMaxVisible = true;
                }
                else if(this.dataDisplay.getResizeHeightMode() == DATA_DISPLAY_CONSTANTS.RESIZE_HEIGHT_MODE_MAX){
                    showLessVisible = true;
                }
            }

            this.showLessButton.style.display = (showLessVisible) ? "" : "none";
            this.showMoreButton.style.display = (showMoreVisible) ? "" : "none";
            this.showMaxButton.style.display = (showMaxVisible) ? "" : "none";
        }
        
    }

    /** This method shold be called when the content loaded or frame visible state 
     * changes to manage the data display.
     * private */
    updateDataDisplayLoadedState() {
        
        if((this.isComponentShowing)&&(this.isViewActive)) {
            if(!this.dataDisplayLoaded) {
                if(!this.dataDisplay) {
                    //the display should be created only when it is made visible
                    this.dataDisplay =  this.component.getDataDisplay(this,this.viewType);
                    this.dataDisplay.readUiStateData(this.savedUiState);
                    if(!this.uiCompleted) this.completeUI();
                    this.setContent(this.dataDisplay.getContent());
                    this.dataDisplay.showData();
                }
            
                if(this.dataDisplay.onLoad) this.dataDisplay.onLoad();
                this.dataDisplayLoaded = true;
            }
        }
        else {
            if(this.dataDisplay) {
                if(this.dataDisplayLoaded) {
                    this.dataDisplayLoaded = false;
                    if(this.dataDisplay.onUnload) this.dataDisplay.onUnload();
                }
                
                //we will destroy the display is the destroyViewOnInactive flag is set, and we are inactive
                if((this.destroyViewOnInactive)&&(!this.isViewActive)) {
                    //update the saved UI state
                    this.dataDisplay.addUiStateData(this.savedUiState);

                    //remove content
                    this.safeRemoveContent();
                    //destroy the display
                    if(this.dataDisplay.destroy) this.dataDisplay.destroy();
                    this.dataDisplay = null;
                }
            }  
        }
        
            
        //fyi - this is remove code, when we need to add it
        //[]
    }

    //------------------------------
    // standard methods
    //------------------------------

    /** The displayDestroyFlags indicate when the display for this view mode will be destroyed,
     * refering to times it is not visible to the user. See further notes in the constructor
     * description. */
    setDisplayDestroyFlags(displayDestroyFlags) {
        
        //note - I should probably update app to only use this one flag.
        this.destroyViewOnInactive = (displayDestroyFlags & DATA_DISPLAY_CONSTANTS.DISPLAY_DESTROY_FLAG_INACTIVE != 0);
    }   

    /** This method cleasr the data display. It should only be called when the data display is not showing. 
     * maybe allow this when the display is showing - unload and reload it*/
    forceClearDisplay() {

        //update the stored UI state json
        this.savedUiState = this.getStateJson();

        //this destrpys the data display, not the container - bad name
        this.destroy();

        //this gets rid of the data display specific parts of the ui
        this.uncompleteUI();

        //reload display
        this.updateDataDisplayLoadedState();
    }

    /** This method destroys the data display. */
    destroy() {
        if(this.dataDisplay) {
            if(this.dataDisplay.destroy) {
                this.dataDisplay.destroy();
            }
            this.dataDisplay = null;
            this.dataDisplayLoaded = false;
        }
    }

    /** This method should be called called before the view mode is closed. It should
     * return true or false. NO - IT RETURNS SOMETHING ELSE! FIX THIS! */
    isCloseOk() {
        if(this.dataDisplay) {
            if(this.dataDisplay.isCloseOk) {
                return this.dataDisplay.isCloseOk();
            }
            
            if(this.inEditMode) {
                return DisplayContainer.UNSAVED_DATA;
            }
        }
        
        return DisplayContainer.CLOSE_OK;
    }
        
    /** This method is called when the member is updated, to make sure the 
    * data display is up to date. */
    memberUpdated() {
        //update the data display
        if((this.dataDisplay)&&(!this.inEditMode)) {
            this.dataDisplay.showData();
            this.updateViewSizeButtons();
        }
    }
        
    //------------------------------
    // Accessed by the Editor, if applicable
    //------------------------------

    onCancel() {
        //reload old data
        this.dataDisplay.showData();
        
        return true;
    }

    startEditMode(onSave,onCancel) {
        if(!this.inEditMode) {
            this.inEditMode = true;
            var saveBar = getSaveBar(onSave,onCancel);
            this.setHeaderContent(saveBar);
        }
    }

    endEditMode() {
        //exit edit mode
        if(this.inEditMode) {
            this.inEditMode = false;
            this.setHeaderContent(null);
        }
        //select the associated node in the document.
        let parentComponent = this.component.getParentComponent();
        if(parentComponent) {
            let name = this.component.getMember().getName();
            parentComponent.selectApogeeNode(name);
        }
        //give the editor focus
        parentComponent.giveEditorFocusIfShowing();

    }

    isInEditMode() {
        return this.inEditMode;
    }


    //====================================
    // Internal Methods
    //====================================

    /** This sets the content for the window. If null (or otherwise false) is passed
     * the content will be set to empty.*/
    setHeaderContent(contentElement) {
        apogeeui.removeAllChildren(this.headerContainer);
        if(contentElement) {
            this.headerContainer.appendChild(contentElement);
        }
    }

    /** This sets the content for the window. The content type
     *  can be:
     *  apogeeui.RESIZABLE - for this content, the content is resized to fit the plane frame. The place frame should be initialized with a size.
     *  apogeeui.FIXED_SIZE - for this content, the plain frame is sized to fit the content. ITs size should not be externally set.
     *  apogeeui.SIZE_WINDOW_TO_CONTENT - this is not a content type but a input option for content FIXED_SIZE that shrinks the window to fit the content. It is typically only used for dialog boxes so isn't really relevent here.
     */
    setContent(contentElement) {
        
        apogeeui.removeAllChildren(this.viewContainer);
        
        //set the content
        this.viewContainer.appendChild(contentElement);
        this.content = contentElement;
    }

    /** This method removes the given element from the content display. If the element
     * is not in the content display, no action is taken. */
    safeRemoveContent() {
        for(var i = 0; i < this.viewContainer.childNodes.length; i++) {
            var node = this.viewContainer.childNodes[i];
            if(node === this.content) {
                this.viewContainer.removeChild(this.content);
                this.content = null;
            }
        }
    }

}

/** This method returns the main dom element for the window frame. */
PageDisplayContainer.COMPONENT_LABEL_EXPAND_BUTTON_PATH = "/closed_gray.png";
PageDisplayContainer.VIEW_TITLE_CONTRACT_BUTTON_PATH = "/opened_gray.png";


