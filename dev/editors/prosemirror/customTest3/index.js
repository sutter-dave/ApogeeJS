
//=======================
// Create the test block schema
//=======================

const {Schema} = require("prosemirror-model")
const {schema} = require("prosemirror-schema-basic")

var NodeXXX;
function NodeLoad() {
    const {Node} = require("prosemirror-model");
    NodeXXX = Node;
}
NodeLoad();


const testBlockSpec = {
  group: "block",
  marks: "",
  draggable: true,

  attrs: {"state": {default: ""}},
  toDOM: node => ["div", {"data-state": JSON.stringify(node.attrs.state)}],
  parseDOM: [{
        tag: "div[data-state]",
        getAttrs: (dom) => {
            let stateText = dom.getAttribute("data-state");
            let state;
            if(stateText !== undefined) {
                state = JSON.parse(stateText);
            }
            else {
                state = ""
            }
            return {state};
        }
    }]
}

 const testBlockSchema = new Schema({
   nodes: schema.spec.nodes.addBefore("image", "testBlock", testBlockSpec),
   marks: schema.spec.marks
 })

//===================
//add test block command
//===================

const {insertPoint} = require("prosemirror-transform")
const {MenuItem} = require("prosemirror-menu")
const {buildMenuItems} = require("prosemirror-example-setup")
const {Fragment} = require("prosemirror-model")

let menu = buildMenuItems(testBlockSchema)
menu.insertMenu.content.push(new MenuItem({
  title: "Insert Test Block",
  label: "Test Block",
  select(state) {
    return insertPoint(state.doc, state.selection.from, testBlockSchema.nodes.testBlock) != null
  },
  run(state, dispatch) {
    let {empty, $from, $to} = state.selection, content = Fragment.empty
    if (!empty && $from.sameParent($to) && $from.parent.inlineContent)
      content = $from.parent.content.cut($from.parentOffset, $to.parentOffset)
    dispatch(state.tr.replaceSelectionWith(testBlockSchema.nodes.testBlock.create({"state":""})))
  }
}))


//==============================
// Add a test block view class
//==============================

const {StepMap} = require("prosemirror-transform")
const {keymap} = require("prosemirror-keymap")
const {undo, redo} = require("prosemirror-history")

class TestBlockView {
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node
    this.view = view
    this.getPos = getPos

    // The node's representation in the editor
    this.dom = document.createElement("div");
    
    this.saveButton = document.createElement("button");
    this.saveButton.innerHTML = "Save";
    this.saveButton.onclick = () => this.save();
    this.dom.appendChild(this.saveButton);
    
    this.cancelButton = document.createElement("button");
    this.cancelButton.innerHTML = "Cancel";
    this.cancelButton.onclick = () => this.cancel();
    this.dom.appendChild(this.cancelButton);
    
    this.dom.appendChild(document.createElement("br"));

    this.textArea = document.createElement("textarea");
    this.dom.appendChild(this.textArea);

    this.contentDiv = document.createElement("div");
    this.dom.appendChild(this.contentDiv);
    
    this.setViewDataFromNode();
    
  }
  
  ///////////////////////////////////////////////////////////////////
  //start my new functions
  
    save() {
        let targetText = this.textArea.value;
        let targetData;
        try {
          targetData = JSON.parse(targetText);
        }
        catch(error) {
          alert("Error parsing JSON input!");
          return;
        }
        let start = this.getPos();
        let end = this.getPos() + this.node.nodeSize;
        let newNode = testBlockSchema.nodes.testBlock.create({"state":targetData})
        
        let tr = this.view.state.tr.replaceWith(start, end, newNode);
        this.view.dispatch(tr);
    }

  
  cancel() {
      //replace value in text area
      this.textArea.value = this.node.textContent;
      var textData = this.getTextData();
      this.contentDiv.innerHTML = textData;
  }
  
  
  
  //end my new functions
  ////////////////////////////////////////////////////////////////////
  
  selectNode() {
    this.dom.classList.add("ProseMirror-selectednode")
    //if (!this.innerView) this.open()
  }

  deselectNode() {
    this.dom.classList.remove("ProseMirror-selectednode")
    //if (this.innerView) this.close()
  }  

    setViewDataFromNode() {  
        var textData = this.getTextData();
        this.textArea.value = textData
        this.contentDiv.innerHTML = textData;
    }
    
    getJsonData() {
//get the attribute!!!!
        var stateJson = this.node.attrs["state"];
        if(stateJson === undefined) stateJson = "";
        return stateJson;
    }
    
    getTextData() {
//get the json data and make to text
        var data = this.getJsonData();
        var textData;
        if(data == null) textData = "";
        else textData = JSON.stringify(data);
        return textData;
    }
  
  update(node) {
    if (!node.sameMarkup(this.node)) return false
    this.node = node;
    this.setViewDataFromNode();
    return true
  }
  
  destroy() {
//    if (this.innerView) this.close()
  }

  stopEvent(event) {
      return true;
  }

  ignoreMutation() { return true }
}

//==============================
// Create the editor
//==============================

const {EditorState} = require("prosemirror-state")
const {DOMParser} = require("prosemirror-model")
const {EditorView} = require("prosemirror-view")
const {exampleSetup} = require("prosemirror-example-setup")

//var startDoc = DOMParser.fromSchema(testBlockSchema).parse(document.querySelector("#content"));
var startDoc = DOMParser.fromSchema(testBlockSchema).parse("");

var state = EditorState.create({    
    doc: startDoc,
    plugins: exampleSetup({schema: testBlockSchema, menuContent: menu.fullMenu})
  })

window.view = new EditorView(document.querySelector("#editor"), {
  state: state,
  nodeViews: {
    testBlock(node, view, getPos) { 
        return new TestBlockView(node, view, getPos) 
    }
  }
})

function saveState() {
    var stateJson = window.view.state.toJSON();
    console.log(JSON.stringify(stateJson));
}

function openState() {
    var stateText = prompt("Enter the state json:");
    var stateJson = JSON.parse(stateText);
    var doc = NodeXXX.fromJSON(testBlockSchema,stateJson.doc);
    var state = EditorState.create({
        doc: doc,
        plugins: exampleSetup({schema: testBlockSchema, menuContent: menu.fullMenu})
    });
    window.view.updateState(state);
}

function showSelection() {
    var selection = window.view.state.selection;
    console.log(JSON.stringify(selection));
}



