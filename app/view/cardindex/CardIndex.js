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
        displayField        : 'title',
        useTitleAsBackText  : false,
        backButtonHiddenState: true,
        
        layout: {
            type: 'card',
            animation: {
                duration: 500,
                easing: 'ease-in-out',
                type: 'slide',
                direction: 'left'
            }
        },
        
        listConfig  : {
            selectedCls: '',
            variableHeights: true,
            itemCls: 'forwardListButton',
            itemTpl: '<span class="listText">{title}</span>' +
                     '<div class="x-button x-hasbadge listBadge">' + 
                     '<tpl if="questionCount &gt; 0">' +
                     '<span class="redbadgeicon badgefixed">{questionCount}</span></tpl></div>'
        }
    },
    
    constructor: function(args) {
        this.callParent(args);

        if(typeof args !== 'undefined') {
            this.withEditFunction = args.edit;
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
                        /** save back button hidden state */
                        me.backButtonHiddenState = me.getBackButton().isHidden();
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
        
        this.setStoreData();
        
        /**
         * listeners to perfom on specified events
         */
        this.on('back', this.modifyToolbarTitles);
        this.onBefore('painted', this.onActivate);
        this.onAfter('itemtap', this.modifyToolbarTitles);
        this.onBefore('activeitemchange', this.onListChange);
    },
    
    /**
     * creates instance of CardIndexStore, sets store data and 
     * assigns store to cardIndex
     */
    setStoreData: function() {
        var me = this;
        LernApp.app.storageController.storeCardIndexTree(function(data) {
            me.setStore(Ext.create('LernApp.store.CardIndexStore').setData(data));
            Ext.Viewport.setMasked(false);
        });
    },
    
    /**
     * actions to perform after panel activation and before panel is painted
     */
    onActivate: function() {
        if(this.withEditFunction) {
            this.getToolbar().add(this.editToggleField);
            this.getToolbar().setTitle(Messages.EDIT_CARD_INDEX);
        } 
        else {
            this.getToolbar().setTitle('');
        }
        
        LernApp.app.main.navigation.getNavigationBar().getBackButton().setText(Messages.HOME);
        this.getToolbar().setTitle(Messages.EDIT_CARD_INDEX);
        
        this.modifyToolbarTitles();
    },
    
    /**
     * actions to perform on activeitemchange
     */
    onListChange: function(panel, newList) {        
        if(newList !== 0) {
            var innerListItems = newList.getInnerItems()[0].getInnerItems();
            
            /** saveid to dom.nodeId */
            /** replace itemCls of leaf nodes */
            innerListItems.forEach(function(element, index, array) {
                element.bodyElement.dom.nodeId = element.getRecord().get('id');
                
                if(element.getRecord().get('leaf')) {
                    element.addCls('leafListItem');
                    element.removeCls('forwardListButton');
                }
            });
        }
    },
    
    /**
     * saves back button hidden state and sets toolbar titles
     */
    modifyToolbarTitles: function() {
        var navigationBar = LernApp.app.main.navigation.getNavigationBar();
                
        /** set navigationBar title */
        navigationBar.setTitle( this.getTitle() );
        if(this.withEditFunction) this.getToolbar().setTitle(Messages.EDIT_CARD_INDEX);
        else this.getToolbar().setTitle('');
    },
    
    /**
     * toggles backbutton hidden state
     */
    toggleBackButtonHidden: function() {        
        if(!this.getBackButton().isHidden()) this.getBackButton().hide();
        else this.getBackButton().setHidden(this.backButtonHiddenState);
    },
    
    /**
     * Update list icons. If editMode is enabled the correlate icon to each
     * listItem is added. Otherwise the icons will be removed.
     */
    updateListIcons: function() {
        var me = this,
            editMode = this.getEditMode();
            list = this.getActiveItem().getInnerItems()[0].getInnerItems();

        /** iterate through all listItems */
        list.forEach(function(element, index, array) {         
            if(editMode) {
                var cat = element.bodyElement.dom.nodeId;
                
                LernApp.app.storageController.getStoredCategories(function(categories) {
                    if(typeof categories[cat] === 'undefined') {
                        element.addCls('addIcon');
                        element.removeCls('deleteIcon');
                    }
                    else {
                        element.addCls('deleteIcon');
                        element.removeCls('addIcon');
                    }
                });
                
                if(element.getRecord().get('leaf')) {
                    element.bodyElement.down('.redbadgeicon').addCls('invisible');
                }
            }
            else {
                element.removeCls('addIcon');
                element.removeCls('deleteIcon');
                
                if(element.getRecord().get('leaf')) {
                    element.bodyElement.down('.redbadgeicon').removeCls('invisible');
                }
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
            
            LernApp.app.storageController.getQuestions(node.getId(), function(questions) {
                var panel = Ext.create('LernApp.view.learncard.CardCarousel', { questions: questions});
                LernApp.app.main.navigation.push(panel);
            });
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
        var category = node.getData().id;
        
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
        var me = this,
            leaf = node.isLeaf(),
            category = node.getData().id;
            
        var categoryModification = {
            added: new Object(),
            deleted: new Object()
        }

        LernApp.app.storageController.getStoredCategories(function(categories) {
            if(typeof categories[category] === 'undefined') {
                categoryModification.added[category] = leaf;
                categoryModification = me.performEditOnChildItem(node.childNodes, categoryModification, false);
                Ext.Viewport.setMasked({xtype:'loadmask', message:'Lade...'});
            } 
            else {
                categoryModification.deleted[category] = leaf;
                categoryModification = me.performEditOnChildItem(node.childNodes, categoryModification, true);
                Ext.Viewport.setMasked({xtype:'loadmask', message:'Lösche...'});
            }
            
            LernApp.app.storageController.removeStoredCategories(categoryModification.deleted, function() {
                LernApp.app.storageController.addStoredCategories(categoryModification.added, function() {
                    LernApp.app.storageController.storeMultipleQuestions(categoryModification.added, function() {
                        me.updateListIcons();
                        Ext.Viewport.setMasked(false);
                    });
                });
            })
        });
    },
    
    /**
     * Adding/removing (depends on deleteFlag) listItems and their children
     * recursively. Stops when a leaf item is performed.
     * 
     * @param {Array} childNodes The childNodes which should be changed.
     * @param {Boolean} deleteFlag
     * @param {Object} categoryModification
     */
    performEditOnChildItem: function (childNodes, categoryModification, deleteFlag) {
        var me = this;
        
        childNodes.forEach(function(element, index, array) {
            var leaf = element.isLeaf(),
                category = element.getData().id;
            
            if(!deleteFlag) categoryModification.added[category] = leaf;
            else categoryModification.deleted[category] = leaf;
            
            if(!leaf) {
                categoryModification = me.performEditOnChildItem(element.childNodes, categoryModification, deleteFlag);
            }
        });

        return categoryModification;
    }
});
