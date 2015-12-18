util = {};

var OBJECT_CONSTRUCTOR = {}.constructor;
var ARRAY_CONSTRUCTOR = [].constructor;
util.getObjectType = function(data) {
	if(data == null) return "value";
	
	if(data.constructor == OBJECT_CONSTRUCTOR) {
		return "object";
	}
	else if(data.constructor == ARRAY_CONSTRUCTOR) {
		return "array";
	}
	else {
		return "value";
	}
}

var PIXELS_PER_INDENT = 10;
util.createIndentElement = function(indentLevel) {
	var cell = document.createElement("div");
	cell.className = "indentCell";
	cell.style.width = (PIXELS_PER_INDENT * indentLevel) + "px";
	return cell;
}
util.createKeyElement = function(key,type,isVirtual,parentValue) {
    var className;
    if(type == "key") {
        var overrideCallback = null;
        
        if(isVirtual) {
            className = "virtualKeyCell";
            overrideCallback = function(editValue) {
                parentValue.insertElement(editValue,"");
            }
        }
        else {
            className = "keyCell";
        }
        
        //create an editable key entry
        return new EditField(key,className,overrideCallback);
    }
    else if(type == "index") { 
        if(isVirtual) {
            className = "virtualIndexCell";
        }
        else {
            className = "indexCell";
        }
        
        //create a non editable entry
        return new FixedField(key,className);   
    }
    else {
        throw "Invalid key type.";
    }
}
util.createValueElement = function(value,isVirtual,parentValue) {
	var className;
    var overrideCallback = null;
    if(isVirtual) {
        className = "virtualValueCell";
        overrideCallback = function(editValue) {
            parentValue.insertElement("",editValue);
        }
    }
    else {
        className = "valueCell";
    }
    return new EditField(value,className,overrideCallback);
}
util.createObjectDelimiter = function(delimiter) {
	var cell = document.createElement("div");
	cell.className = "objectDelimCell";
	cell.innerHTML = delimiter;
	return cell;
}
util.createExpandButton = function(valueEntry) {
	var cell = document.createElement("div");
	cell.className = "buttonCell";
	cell.innerHTML = "+";
	cell.onclick = function() {
		valueEntry.setExpanded(true);
	}
	return cell;
}
util.createContractButton = function(valueEntry) {
	var cell = document.createElement("div");
	cell.className = "buttonCell";
	cell.innerHTML = "-";
	cell.onclick = function() {
		valueEntry.setExpanded(false);
	}
	return cell;
}

