module('lively.morphic.SAPUI5').requires('lively.morphic.HTML').toRun(function() {

lively.morphic.Box.subclass('lively.morphic.SAPUI5.Button',

'settings',{
    classes: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnStd',    
    activeClasses: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnAct',
    disabledClasses: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnDsbl',
    label: "Button"
},
'HTML render settings', {
    htmlDispatchTable: {
        updateLabel: 'updateLabelHTML',
        resizeButton: 'resizeButtonHTML',
        getButtonExtent: 'getButtonExtentHTML',
        setButtonNodeClass: 'setButtonNodeClassHTML',
    },
},
'initializing', {
    initialize: function($super, bounds, optLabel) {
        $super(bounds);
        if (optLabel) this.setLabel(optLabel);
        this.value = false;
        this.toggle = false;
        this.isActive = true;
        
    }
},

'rendering', {
    initHTML: function($super, ctx) {
        if (!ctx.buttonNode)
            ctx.buttonNode= this.createButtonNodeHTML();
        this.setButtonNodeClass(this.isActive?this.classes:this.disabledClasses);
        ctx.subNodes = [];
        $super(ctx);
        if (this.shape) this.updateLabel(this.label || "Button")
    },
    appendHTML: function($super, ctx, optMorphAfter) {
        $super(ctx, optMorphAfter);
        this.appendButtonHTML(ctx);
    },
    appendButtonHTML: function(ctx) {
        ctx.shapeNode.appendChild(ctx.buttonNode);
        this.resizeButtonHTML(ctx);
    },

    setClipModeHTML: function(ctx, clipMode) {
        // FIXME duplication wiht super, delay logic
        // can be extracted
        if (!ctx.buttonNode || this.delayedClipMode) {
            this.delayedClipMode = clipMode;
            return;
        }
        this.setClipModeHTMLForNode(ctx, ctx.buttonNode, clipMode);
    },
    resizeButtonHTML: function(ctx) {
        var borderWidth = this.getBorderWidth(),
            extent = this.getExtent().subPt(pt(2*borderWidth, 2*borderWidth)),
            buttonNode= ctx.buttonNode;
        buttonNode.style.left = this.shape.getPosition().x /*+ this.padding.left()*/ + 'px';
        buttonNode.style.top = this.shape.getPosition().y /*+ this.padding.top()*/ + 'px';
        buttonNode.style.width = extent.x /*- this.padding.right() - this.padding.left())*/ + 'px';
        buttonNode.style.height = extent.y /*- this.padding.bottom() - this.padding.top()*/ + 'px';
    },
    updateLabelHTML: function(ctx, label) {
        ctx.buttonNode.innerHTML = label;
    },
    setButtonNodeClassHTML: function(ctx, className) {
        ctx.buttonNode.className = className;
    }
},

'node creation', {
    createButtonNodeHTML: function() {
        var node = XHTMLNS.create('button');
        return node;
    },
    getButtonExtentHTML: function(ctx) {
        return ctx.buttonNode.scrollHeight != 0 ? pt(ctx.buttonNode.scrollWidth, ctx.buttonNode.scrollHeight) : this.getExtent()
    },
},

'accessing', {
    setActive: function(active) {
        this.isActive = active;
        if (active) this.pressed = false;
        this.changeAppearanceFor(false);
    },
    setExtent: function($super, extent) {
        $super(extent);
        this.resizeButton();
    },
    resizeButton: function(idx) {
        return this.renderContextDispatch('resizeButton');
    },
    getButtonExtent: function() { return this.renderContextDispatch('getButtonExtent') },
    updateLabel: function(label) {
        this.label = label;
        this.renderContextDispatch('updateLabel', label);
    },
    setLabel: function(label) {
        this.updateLabel(label);
    },
    getLabel: function() {
        return this.label;    
    },
    morphMenuItems: function($super) {
        var self = this, items = $super();
        items.push([
            'Set label', function(evt) {
            $world.prompt('Set label', function(input) {
                if (input !== null)
                    self.setLabel(input || '');
            }, self.getLabel());
        }])
        return items;
    },
    setButtonNodeClass: function(className) {
        this.renderContextDispatch('setButtonNodeClass', className);     
    }
    
},
'event handling', {
    changeAppearanceFor: function(pressed) {
        if (pressed) {
            this.setButtonNodeClass(this.activeClasses);
        } else {
            this.setButtonNodeClass(this.isActive?this.classes:this.disabledClasses);
        }
  
    },
    /*
    onClick: function(evt) {
         if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) {
            evt.stop()
            return true;
        }
        lively.bindings.signal(this, 'fire', true);
         return true;
     },
*/
    onMouseOut: function (evt) {
        this.isPressed && this.changeAppearanceFor(false);
    },

    onMouseOver: function (evt) {
        if (evt.isLeftMouseButtonDown()) {
            this.isPressed && this.changeAppearanceFor(true);
        } else {
            this.isPressed = false;
        }
    },

    onMouseDown: function (evt) {
        if (this.isValidClick (evt)) {
                this.isPressed = true;
                this.changeAppearanceFor(true);
        }
        return false;
    },

    onMouseUp: function(evt) {
        if (this.isValidClick (evt) && this.isPressed) {
            var newValue = this.toggle ? !this.value : false;
            this.setValue(newValue);
            this.changeAppearanceFor(false);
            this.isPressed = false;
        }
        return false;
    },
    isValidClick: function(evt) {
        return this.isActive && evt.isLeftMouseButtonDown() && !evt.isCommandKey();
    },
    setValue: function(bool) {
        this.value = bool;
        // buttons should fire on mouse up
        if (!bool || this.toggle) lively.bindings.signal(this, 'fire', bool);
    },

}
);

lively.morphic.Box.subclass('lively.morphic.SAPUI5.CheckBox',

'settings',{
    classes: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnStd',    
    activeClasses: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnAct',
    disabledClasses: 'sapUiBtn sapUiBtnNorm sapUiBtnS sapUiBtnDsbl',
    label: "Checkbox"
},
'HTML render settings', {
    htmlDispatchTable: {
        updateLabel: 'updateLabelHTML',
        resizeCheckBox: 'resizeCheckBoxHTML',
        getCheckBoxExtent: 'getCheckBoxExtentHTML',
        setCheckBoxNodeClass: 'setCheckBoxNodeClassHTML',
    },
},
'initializing', {
    initialize: function($super, bounds, optLabel) {
        $super(bounds);
        if (optLabel) this.setLabel(optLabel);
        this.value = false;
        this.toggle = false;
        this.isActive = true;
        
    }
},

'rendering', {
    initHTML: function($super, ctx) {
        if (!ctx.wrapperNode)
            ctx.wrapperNode= this.createButtonNodeHTML();
        this.setButtonNodeClass(this.isActive?this.classes:this.disabledClasses);
        ctx.subNodes = [];
        $super(ctx);
        if (this.shape) this.updateLabel(this.label || "Button")
    },
    appendHTML: function($super, ctx, optMorphAfter) {
        $super(ctx, optMorphAfter);
        this.appendButtonHTML(ctx);
    },
    appendButtonHTML: function(ctx) {
        ctx.shapeNode.appendChild(ctx.buttonNode);
        this.resizeButtonHTML(ctx);
    },

    setClipModeHTML: function(ctx, clipMode) {
        // FIXME duplication wiht super, delay logic
        // can be extracted
        if (!ctx.buttonNode || this.delayedClipMode) {
            this.delayedClipMode = clipMode;
            return;
        }
        this.setClipModeHTMLForNode(ctx, ctx.buttonNode, clipMode);
    },
    resizeButtonHTML: function(ctx) {
        var borderWidth = this.getBorderWidth(),
            extent = this.getExtent().subPt(pt(2*borderWidth, 2*borderWidth)),
            buttonNode= ctx.buttonNode;
        buttonNode.style.left = this.shape.getPosition().x /*+ this.padding.left()*/ + 'px';
        buttonNode.style.top = this.shape.getPosition().y /*+ this.padding.top()*/ + 'px';
        buttonNode.style.width = extent.x /*- this.padding.right() - this.padding.left())*/ + 'px';
        buttonNode.style.height = extent.y /*- this.padding.bottom() - this.padding.top()*/ + 'px';
    },
    updateLabelHTML: function(ctx, label) {
        ctx.buttonNode.innerHTML = label;
    },
    setButtonNodeClassHTML: function(ctx, className) {
        ctx.buttonNode.className = className;
    }
},

'node creation', {
    createButtonNodeHTML: function() {
        var node = XHTMLNS.create('button');
        return node;
    },
    getButtonExtentHTML: function(ctx) {
        return ctx.buttonNode.scrollHeight != 0 ? pt(ctx.buttonNode.scrollWidth, ctx.buttonNode.scrollHeight) : this.getExtent()
    },
},

'accessing', {
    setActive: function(active) {
        this.isActive = active;
        if (active) this.pressed = false;
        this.changeAppearanceFor(false);
    },
    setExtent: function($super, extent) {
        $super(extent);
        this.resizeButton();
    },
    resizeButton: function(idx) {
        return this.renderContextDispatch('resizeButton');
    },
    getButtonExtent: function() { return this.renderContextDispatch('getButtonExtent') },
    updateLabel: function(label) {
        this.label = label;
        this.renderContextDispatch('updateLabel', label);
    },
    setLabel: function(label) {
        this.updateLabel(label);
    },
    getLabel: function() {
        return this.label;    
    },
    morphMenuItems: function($super) {
        var self = this, items = $super();
        items.push([
            'Set label', function(evt) {
            $world.prompt('Set label', function(input) {
                if (input !== null)
                    self.setLabel(input || '');
            }, self.getLabel());
        }])
        return items;
    },
    setButtonNodeClass: function(className) {
        this.renderContextDispatch('setButtonNodeClass', className);     
    }
    
},
'event handling', {
    changeAppearanceFor: function(pressed) {
        if (pressed) {
            this.setButtonNodeClass(this.activeClasses);
        } else {
            this.setButtonNodeClass(this.isActive?this.classes:this.disabledClasses);
        }
  
    },
    /*
    onClick: function(evt) {
         if (evt.isCommandKey() || !evt.isLeftMouseButtonDown()) {
            evt.stop()
            return true;
        }
        lively.bindings.signal(this, 'fire', true);
         return true;
     },
*/
    onMouseOut: function (evt) {
        this.isPressed && this.changeAppearanceFor(false);
    },

    onMouseOver: function (evt) {
        if (evt.isLeftMouseButtonDown()) {
            this.isPressed && this.changeAppearanceFor(true);
        } else {
            this.isPressed = false;
        }
    },

    onMouseDown: function (evt) {
        if (this.isValidClick (evt)) {
                this.isPressed = true;
                this.changeAppearanceFor(true);
        }
        return false;
    },

    onMouseUp: function(evt) {
        if (this.isValidClick (evt) && this.isPressed) {
            var newValue = this.toggle ? !this.value : false;
            this.setValue(newValue);
            this.changeAppearanceFor(false);
            this.isPressed = false;
        }
        return false;
    },
    isValidClick: function(evt) {
        return this.isActive && evt.isLeftMouseButtonDown() && !evt.isCommandKey();
    },
    setValue: function(bool) {
        this.value = bool;
        // buttons should fire on mouse up
        if (!bool || this.toggle) lively.bindings.signal(this, 'fire', bool);
    },

}
);





}) // end of module