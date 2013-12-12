/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/cardindex/CardIndex.js
  - Beschreibung:	CardIndex.
  - Autor(en):		Andreas Gärtner <andreas.gaertner@hotmail.com>
  +--------------------------------------------------------------------------------+
  This program is free software; you can redistribute it and/or modify it under 
  the terms of the GNU General Public License as published by the Free Software
  Foundation; either version 3 of the License, or any later version.
  +--------------------------------------------------------------------------------+
  This program is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
  PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with 
  this program; if not, see <http://www.gnu.org/licenses/>.
  +--------------------------------------------------------------------------------+
  Inoffizielle deutsche Übersetzung (http://www.gnu.de/documents/gpl.de.html):

  Dieses Programm ist freie Software. Sie können es unter den Bedingungen der 
  GNU General Public License, wie von der Free Software Foundation veröffentlicht,
  weitergeben und/oder modifizieren, entweder gemäß Version 3 der Lizenz oder 
  jeder späteren Version.
  +--------------------------------------------------------------------------------+
  Die Veröffentlichung dieses Programms erfolgt in der Hoffnung, daß es Ihnen von
  Nutzen sein wird, aber OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie
  der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN BESTIMMTEN ZWECK. Details finden
  Sie in der GNU General Public License.
  Sie sollten ein Exemplar der GNU General Public License zusammen mit diesem Programm
  erhalten haben. Falls nicht, siehe <http://www.gnu.org/licenses/>.
  +--------------------------------------------------------------------------------+
*/

Ext.define('LernApp.view.cardindex.CardIndex', {
    extend: 'Ext.NestedList',
    xtype: 'cardIndex',

    requires: [
        'Ext.field.Toggle',
        'Ext.MessageBox',
        'LernApp.store.CardIndexStore'
    ],
    
    config: {
        title               : Messages.CARD_INDEX,
        backText            : Messages.BACK,
        editMode            : false,
        fullscreen          : true,
        displayField        : 'text',
        useTitleAsBackText  : false,
        backButtonHiddenState: true,
        
        store: Ext.create('LernApp.store.CardIndexStore'),
        
        listConfig  : {
            variableHeights: true,
            itemCls: 'forwardListButton',
            itemTpl: '<span class="listText">{text}</span>'
        }
    },
    
    initialize: function() {
        var me = this;
        
        /**
         * toggleField - enables/disables edit mode
         */
        this.editToggleField = Ext.create('Ext.field.Toggle', {
            align: 'right',
            cls: 'editToggleBox',
            listeners: {
                change: function (slider, newValue, oldValue) {
                    if (newValue) {
                        me.setEditMode(true);
                    }
                    else {
                        me.setEditMode(false);
                    }
                    me.toggleBackButtonHidden();
                    me.updateListIcons();
                }
            }
        });
        
        /**
         * listeners to perfom after specified events
         */
        this.on('back', this.onListChange);
        this.onBefore('painted', this.onActivate);
        this.onAfter('itemtap', this.onListChange);
    },
    
    /**
     * actions to perform after panel activation and before panel is painted
     */
    onActivate: function() {
        LernApp.app.main.navigation.getNavigationBar().getBackButton().setText(Messages.HOME);
        this.getToolbar().setTitle(Messages.EDIT_CARD_INDEX);
        this.getToolbar().add(this.editToggleField);
        this.onListChange();
    },
    
    /**
     * actions to perform on itemtap or backbutton tap
     */
    onListChange: function(panel, list, selections) {
        var navigationBar = LernApp.app.main.navigation.getNavigationBar();
        
        /** save back button hidden state */
        this.setBackButtonHiddenState = this.getBackButton().isHidden();
        
        /** set navigationBar title */
        navigationBar.setTitle( this.getTitle() );
        this.getToolbar().setTitle(Messages.EDIT_CARD_INDEX);
    },
    
    /**
     * toggles backbutton hidden state
     */
    toggleBackButtonHidden: function() {
        if(!this.getBackButton().isHidden()) this.getBackButton().hide();
        else if(!this.setBackButtonHiddenState) this.getBackButton().show();
    },
    
    /**
     * Update list icons. If editMode is enabled the correlate icon to each
     * listItem is added. Otherwise the icons will be removed.
     */
    updateListIcons: function() {
        var editMode = this.getEditMode();
        var list = this.getActiveItem().getInnerItems()[0].getInnerItems();

        /** iterate through all listItems */
        list.forEach(function(element, index, array) {
            if(editMode) {
                /** replace trailed newline */
                var cat = element.bodyElement.dom.innerText.replace(/(\r\n|\n|\r)/gm,"");
                
                if(localStorage.getItem(cat) !== "true") {
                    element.addCls('addIcon');
                    element.removeCls('deleteIcon');
                }
                else if(localStorage.getItem(cat) == "true") {
                    element.addCls('deleteIcon');
                    element.removeCls('addIcon');
                }
            }
            else {
                element.removeCls('addIcon');
                element.removeCls('deleteIcon');
            }
        });
    },
    
    /** 
     * overwritten event listener onItemTap in order to enable
     * to tab non leaf items when editMode is enabled.
     * 
     * Called when an list item has been tapped.
     * @param {Ext.List} list The subList the item is on.
     * @param {Number} index The id of the item tapped.
     * @param {Ext.Element} target The list item tapped.
     * @param {Ext.data.Record} record The record which as tapped.
     * @param {Ext.event.Event} e The event.
     */
    onItemTap: function (list, index, target, record, e) {
        var me = this,
            store = list.getStore(),
            node = store.getAt(index);
        
        if(this.getEditMode()) {
            me.selectListItem(node);
        }
        else if (node.isLeaf()) {
            me.fireEvent('leafitemtap', this, list, index, target, record, e);
            me.goToLeaf(node);
        }
        else {
            this.goToNode(node);
        }
        
        me.fireEvent('itemtap', this, list, index, target, record, e);
    },
    
    /**
     * actions to perform when a listItem is pressed and editMode is enabled
     * 
     * @param {Ext.data.NodeInterface} node The selected node (listItem).
     */
    selectListItem: function (node) {
        var me = this;
        var category = node.getData().text;
        
        /** the user will need to confirm a removal, if the selected 
         *  item is no leaf item  
         */
        if(!node.isLeaf() && localStorage.getItem(category) == "true") {
            Ext.Msg.confirm(Messages.ATTENTION, Messages.DELETION_NOTICE, function(button){
                if (button == 'yes') me.performEditOnItem(node);
            });
        } else {
            me.performEditOnItem(node);
        }
    },
    
    /**
     * Adding/removing selected listItem and it's children to/from localStore
     * 
     * @param {Ext.data.NodeInterface} node The selected node (listItem).
     */
    performEditOnItem: function(node) {
        var me = this;
        var category = node.getData().text;
        
        if(localStorage.getItem(category) !== "true") {
            localStorage.setItem(category, "true");
            me.performEditOnChildItem(node.childNodes, false);
            Ext.Viewport.setMasked({xtype:'loadmask',message:'Lade...'});
        } 
        else {
            localStorage.removeItem(category);
            me.performEditOnChildItem(node.childNodes, "false");
            Ext.Viewport.setMasked({xtype:'loadmask',message:'Lösche...'});
        }
        
        var task = Ext.create('Ext.util.DelayedTask', function () {
            me.updateListIcons();
            Ext.Viewport.setMasked(false);
        });
        
        task.delay(2000);
    },
    
    /**
     * Adding/removing (depends on deleteFlag) listItems and their children
     * recursively. Stops when a leaf item is performed.
     * 
     * @param {Array} childNodes The childNodes which should be changed.
     * @param {Boolean} deleteFlag
     */
    performEditOnChildItem: function (childNodes, deleteFlag) {
        var me = this;

        childNodes.forEach(function(element, index, array) {
            var category = element.getData().text;
            
            if(deleteFlag) {
                localStorage.removeItem(category);
            }
            else {
                localStorage.setItem(category, true);
            }
            
            /** recursive call */
            if(!element.isLeaf()) {
                me.performEditOnChildItem(element.childNodes, deleteFlag);
            }
        });
    }
});
