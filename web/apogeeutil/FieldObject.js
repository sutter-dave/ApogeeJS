/** This is a mixin for the field object formalism. It is used to store fields
 * and track modifications. It allows you to lock the object so that no more changes
 * can be made. */
let FieldObject = {};
export {FieldObject as default};

/** This initializes the component */
FieldObject.fieldObjectMixinInit = function() {
    this.fieldMap = {};
    this.updated = {};
    this.isLocked = false;
}

/** This sets a field value. It will throw an exception if the object is locked. */
FieldObject.setField = function(name,value) {
    if(this.isLocked) {
        throw new Error("Attempting to set a value on a locked object.");
    }

    this.fieldMap[name] = value;
    this.updated[name] = true;
}

/** This ges a field value, by name. */
FieldObject.getField = function(name) {
    return this.fieldMap[name];
}

/** This method locks the object. On instantiation the object is unlocked and
 * fields can be set. Once it it locked the fields can not be changed. */
FieldObject.lock = function() {
    this.isLocked = true;
}

FieldObject.getIsLocked = function() {
    return this.isLocked;
}

/** This returns a map of the updated fields for this object.  */
FieldObject.getUpdated = function() {
    return this.updated;
}

/** This returns true if the given field is updated. */
FieldObject.isFieldUpdated = function(field) {
    return this.updated[field] ? true : false;
}

/** This method should be implemented for any object using this mixin. 
 * This should give a unique identifier for all objects of the given target type, below. */
//getId() Implmented above

/** Thie method should be implemented for any object using this method. 
 * It identifies the type of object */
//getTargetType() 

/** This loads the current field object to have a copy of the data from the given field object.
 * The update field is however cleared. This method will throw an exception is you try to copy 
 * into a loacked object. */
FieldObject.copyFromFieldsObject = function(otherFieldObject) {
    if(this.isLocked) {
        throw new Error("Attempting to copy fields into a locked object.");
    }

    for(name in otherFieldObject.fieldMap) {
        this.fieldMap[name] = otherFieldObject.fieldMap[name];
    }
    this.updated = {};
}
