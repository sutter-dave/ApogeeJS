import base from "/apogeeutil/base.js";
import EventManager from "/apogeeutil/EventManagerClass.js";

import {addComponent, addAdditionalComponent} from "/apogeeview/commandseq/addcomponentseq.js";
import {bannerConstants,getBanner,getIconOverlay} from "/apogeeview/componentdisplay/banner.js"; 
import PageChildComponentDisplay from "/apogeeview/componentdisplay/literatepage/PageChildComponentDisplay.js"

import {selectionBetween} from "/prosemirror/lib/prosemirror-view/src/selection.js";

import ModelView from "/apogeeview/ModelView.js";

import apogeeui from "/apogeeui/apogeeui.js";
import Tab from "/apogeeui/tabframe/Tab.js";

/** This component represents a json table object. */
export default class LiteratePageComponentDisplay extends EventManager {
    
    constructor(componentView) {
        super();

        this.componentView = componentView;

        this.isShowing = false;

        this.editorManager = this.componentView.getEditorManager();

        this.loadTabEntry();

        //add a cleanup action to the base component - component must already be initialized
    //    this.addCleanupAction(LiteratePageComponentDisplay.destroy);
    };


    getTab() {
        return this.tab;
    }

    getEditorView() {
        return this.editorView;
    }

    closeTab() {
        if(this.tab) {
            this.tab.close();
            this.tab = null;
        }
    }

    getIsShowing() {
        return this.isShowing;
    }

    componentUpdated(fieldsUpdated) {

        if(apogeeutil.isFieldUpdated(fieldsUpdated,"name")) {
            this.tab.setTitle(this.componentView.getName());
        }

        if(apogeeutil.isFieldUpdated(fieldsUpdated,"document")) {
            let editorData = this.componentView.getEditorData();
            this.editorView.updateState(editorData);
        }

        if(apogeeutil.isFieldUpdated(fieldsUpdated,"bannerState")) {
            this._setBannerState();
        }
    }

    //#############################################################################
    //Argh! See ntoes and fix this
    nonComponentDocumentUpdate() {
        let editorData = this.componentView.getEditorData();
        this.editorView.updateState(editorData);
    }
    //##############################################################################

    /** This creates and adds a display for the child component to the parent container. */
    addChild(childComponentView) {

        //-----------------
        // Get component display
        //-----------------
        var childComponentDisplay;

        //create a new component display for this child
        if(childComponentView.constructor.hasChildEntry) {
            childComponentDisplay = new PageChildComponentDisplay(childComponentView,this);
        }

        //------------------
        // add to editor
        //------------------
        if(childComponentDisplay) {
            //set the component display
            childComponentView.setComponentDisplay(childComponentDisplay);
        }
    }

    /** This will move the selection to the end of the document. */
    selectStartOfDocument() {
        let state = this.componentView.getComponent().getEditorData();
        let $startPos = state.doc.resolve(0);
        let selection = selectionBetween(this.editorView, $startPos, $startPos);
        let transaction = state.tr.setSelection(selection).scrollIntoView();
        this.componentView.applyTransaction(transaction);

        this.componentView.giveEditorFocusIfShowing();
    }

    /** This will move the selection to the end of the document. */
    selectEndOfDocument() {
        let state = this.componentView.getEditorData();
        let endPos = state.doc.content.size;
        let $endPos = state.doc.resolve(endPos);
        let selection = selectionBetween(this.editorView, $endPos, $endPos);
        let transaction = state.tr.setSelection(selection).scrollIntoView();
        this.componentView.applyTransaction(transaction);

        this.componentView.giveEditorFocusIfShowing();
    }

////////////////////////////////////////////////////////////////////////////////////////////////

    /** This is to record any state in the tab object. */
    getStateJson() {
        return null;
    }

    /** This is to restore any state in the tab object. */
    setStateJson(json) {
    }

    //===============================
    // Private Functions
    //===============================

    /** @private */
    loadTabEntry() {
        this.tab = new Tab(this.componentView.getComponent().getId());    

        //-----------------------
        //set the content
        //-----------------------
        this.createDisplayContent();

        if(this.tab.getIsShowing()) {
            this.tabShown()
        }
        else {
            this.tabHidden()
        }
        this.tab.addListener(apogeeui.SHOWN_EVENT,() => this.tabShown());
        this.tab.addListener(apogeeui.HIDDEN_EVENT,() => this.tabHidden());
        this.tab.addListener(apogeeui.CLOSE_EVENT,() => this.tabClosed());

        //------------------
        // set menu
        //------------------
        var menu = this.tab.createMenu(this.componentView.getIconUrl());
        var createMenuItemsCallback = () => {
            return this.componentView.getMenuItems();
        }
        menu.setAsOnTheFlyMenu(createMenuItemsCallback);

        //-----------------
        //set the tab title
        //-----------------
        this.tab.setTitle(this.componentView.getName());

        //-----------------
        // apply the banner state
        //-----------------
        this._setBannerState();

        //-----------------------------
        //add the handlers for the tab
        //-----------------------------
        var onClose = () => {
            this.componentView.closeTabDisplay();
            this.destroy();
        }
        this.tab.addListener(apogeeui.CLOSE_EVENT,onClose);
    }

    _setBannerState() {
        let bannerState = this.componentView.getComponent().getBannerState();
        let bannerMessage = this.componentView.getComponent().getBannerMessage();

        apogeeui.removeAllChildren(this.bannerContainer);
        if(bannerState == bannerConstants.BANNER_TYPE_NONE) {
           //no action
        }
        else {
            var banner = getBanner(bannerMessage,bannerState);
            this.bannerContainer.appendChild(banner);
        }

        if(this.tab) {
            var iconOverlay = getIconOverlay(bannerState);
            if(iconOverlay) {
                this.tab.setIconOverlay(iconOverlay);
            }
            else {
                this.tab.clearIconOverlay();
            }
        }
    }

     /** @private */
    createDisplayContent() {

        //-----------
        //page header
        //------------
        this.headerElement = apogeeui.createElementWithClass("div","visiui_litPage_header",null);
        this.tab.setHeaderContent(this.headerElement);

        this.editorToolbarContainer = apogeeui.createElementWithClass("div","visiui_litPage_editorToolbar",this.headerElement);
        this.componentToolbarContainer = apogeeui.createElementWithClass("div","visiui_litPage_componentToolbar",this.headerElement);
        this.bannerContainer = apogeeui.createElementWithClass("div","visiui_litPage_banner",this.headerElement);

        this.initComponentToolbar();

        //-------------------
        //page body
        //-------------------
        this.contentElement = apogeeui.createElementWithClass("div","visiui_litPage_body",null);
        this.tab.setContent(this.contentElement);

        let pageComponent = this.componentView.getComponent();
        let folder = pageComponent.getParentForChildren();

        //we ony use this context menu and child map for parents
        //modify if we use this elsewhere
        if(!folder.isParent) return;

        this.initEditor();

        //show all children
        var modelView = this.componentView.getModelView();
        var children = folder.getChildMap();
        for(var childName in children) {
            var child = children[childName];
            var childComponentView = modelView.getComponentView(child.getId());
            if(childComponentView) {
                this.addChild(childComponentView);
            }
        }
        
        var editorData = pageComponent.getEditorData();
        this.editorView.updateState(editorData);

        //set the selection to the end of the view
        this.selectEndOfDocument();
    }

    initComponentToolbar() {

        //THIS IS BAD - IT IS ONLY TO GET THIS WORKING AS A TRIAL
        //MAKE A WAY TO GET COMPONENT GENERATORS FOR BUTTONS RATHER THAN READING A PRIVATE VARIABLE FROM APP
        let pageComponent = this.componentView.getComponent();
        var modelManager = pageComponent.getModelManager();
        var app = modelManager.getApp();
        var appView = this.componentView.getModelView().getWorkspaceView().getAppView();

        for(var i = 0; i < app.standardComponents.length; i++) {
            let key = app.standardComponents[i];

            let componentClass = app.componentClasses[key];
            let componentViewClass = appView.constructor.getComponentViewClass(componentClass.uniqueName);
            if(componentViewClass.hasChildEntry) {

                var buttonElement = apogeeui.createElementWithClass("div","visiui_litPage_componentButton",this.componentToolbarContainer);
                //make the idon
                var imageElement = document.createElement("img")
                imageElement.src = apogeeui.getResourcePath(componentViewClass.ICON_RES_PATH);
                var iconElement = apogeeui.createElementWithClass("div","visiui_litPage_componentButtonIcon",buttonElement);
                iconElement.appendChild(imageElement);
                //label
                var textElement = apogeeui.createElementWithClass("div","visiui_litPage_componentButtonText",buttonElement);
                textElement.innerHTML = componentClass.displayName;
                //add handler
                buttonElement.onclick = () => {

                    this.editorView.dom.focus();

                    var initialValues = {};
                    initialValues.parentName = this.componentView.getFullName();

                    addComponent(appView,app,componentClass,initialValues,null,null);
                }
            }
        }

        //add the additional component item
        var buttonElement = apogeeui.createElementWithClass("div","visiui_litPage_componentButton",this.componentToolbarContainer);
        var textElement = apogeeui.createElementWithClass("div","visiui_litPage_componentButtonText",buttonElement);
        textElement.innerHTML = "Additional Components...";
        buttonElement.onclick = () => {

            this.editorView.dom.focus();

            var initialValues = {};
            initialValues.parentName = this.componentView.getFullName();

            let appView = this.componentView.getModelView().getWorkspaceView().getAppView();
            let componentViewClassFunction = componentName => appView.constructor.getComponentViewClass(componentName);

            //I tacked on a piggyback for testing!!!
            addAdditionalComponent(app,componentViewClassFunction,initialValues,null,null);
        }
        this.componentToolbarContainer.appendChild(buttonElement);
    }


    initEditor() {
        
        //start with an empty component display
        var emptyEditorState = this.editorManager.createEditorState();
        
        this.editorView = this.editorManager.createEditorView(this.contentElement,this.componentView, emptyEditorState);

        this.contentElement.addEventListener("click",event => this.onClickContentElement(event));

        //add the editor toolbar
        this.editorToolbarContainer.appendChild(this.editorManager.editorToolbarElement);
        
    }

    /** This is used to select the end of the document if the page is clicked below the document end. */
    onClickContentElement(event) {
        if(event.target == this.contentElement) {
            this.selectEndOfDocument();    
        }    
    }

    /** This should be called by the parent component when it is discarding the 
     * page display.  
     * @protected */
    destroy() {
        //we should probably have a less cumbesome way of doing this
        let pageComponent = this.componentView.getComponent();
        let folder = pageComponent.getParentForChildren();
        var children = folder.getChildMap();
        var modelView = this.componentView.getModelView();

        for(var childName in children) {
            var child = children[childName];
            var childComponentView = modelView.getComponentView(child.getId());
            if(childComponentView) {
                childComponentView.closeComponentDisplay();
            }
        }

        if(this.tab) this.closeTab();
    }

    /** @protected */
    tabShown() {
        this.isShowing = true;
        this.dispatchEvent(apogeeui.SHOWN_EVENT,this);
    }

    /** @protected */
    tabHidden() {
        this.isShowing = false;
        this.dispatchEvent(apogeeui.HIDDEN_EVENT,this);
    }

    tabClosed() {
        //delete the page
        this.componentView.closeTabDisplay();
        this.dispatchEvent(apogeeui.CLOSE_EVENT,this);
    }
    
}

/** This is the data to load an empty page. */
LiteratePageComponentDisplay.EMPTY_PAGE_BODY = [];
