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
        selectedDisplayMode : 'tree',
        
        displayModes        : {
            tree: 'tree',
            test: 'test'
        },
        
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
                     '<span class="redbadgeicon badgefixed">{questionCount}</span></tpl>' +
                     '<span class="greenChecker badgefixed invisible">3</span></div>'
        }
    },
    
    initialize: function() {
        var me = this;
        this.withEditFunction = this.edit;
        
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
        
        /**
         * get prefered view and set store data
         */
        this.on('initialize', function() {
            LernApp.app.storageController.getStoredSetting('preferedView', function(view) {
                if(typeof view !== 'undefined') {
                    me.config.selectedDisplayMode = view;
                } 
                
                me.setStoreData();
            });
        });

        /**
         * show viewchange button when panel is painted
         */
        this.onAfter('painted', function() {
            LernApp.app.main.navigation.viewButton.show();
        });
        
        /**
         * hide viewchange button when panel is deactivated
         */
        this.on('deactivate', function() {
            LernApp.app.main.navigation.viewButton.hide();
        });
        
        /**
         * listeners to perfom on specified events
         */
        this.on('back', this.modifyToolbarTitles);
        this.onBefore('painted', this.onActivate);
        this.onAfter('itemtap', this.modifyToolbarTitles);
        this.onBefore('activeitemchange', this.onListChange);
        this.element.on('tap', function(e) { 
            if(!LernApp.app.main.navigation.viewChangePanel.isHidden()) {
                LernApp.app.main.navigation.viewChangePanel.hide();
            }
        });
    },
    
    setDisplayMode: function(mode) {        
        if(mode == this.config.displayModes.test) {
            this.config.selectedDisplayMode = mode;
        } else {
            this.config.selectedDisplayMode = this.config.displayModes.tree;
        }
        LernApp.app.storageController.storeSetting('preferedView', this.config.selectedDisplayMode);
        this.setStoreData();
    },
    
    /**
     * creates instance of CardIndexStore, sets store data and 
     * assigns store to cardIndex
     */
    setStoreData: function() {
        var me = this;
        
        var actions = function(data) {
            if(data == null) me.editToggleField.setHidden(true);
            me.setStore(Ext.create('LernApp.store.CardIndexStore').setData(data));
            Ext.Viewport.setMasked(false);
        };
        
        var actions2 = function(data) {
            var newData = [];
            Object.keys(data).map(function(value, index) {
                newData[index] = data[value];
            });
            actions(newData);
        };

        LernApp.app.storageController.storeCardIndexTree(function(online) {
            LernApp.app.storageController.getStoredIndexTreeObject(function(treeObj) {
                if(online) {
                    LernApp.app.storageController.storeTests(treeObj);
                }
                if(me.config.selectedDisplayMode === me.config.displayModes.tree) {
                    actions(treeObj);
                }
                else LernApp.app.storageController.getStoredTestObject(function(tests) {
                    actions2(tests);
                });
            });
        });
    },
    
    /**
     * actions to perform after panel activation and before panel is painted
     */
    onActivate: function() {
        if(this.withEditFunction) this.getToolbar().add(this.editToggleField);
        else this.getToolbar().setTitle('');
        
        LernApp.app.main.navigation.getNavigationBar().getBackButton().setText(Messages.HOME);  
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
                
                LernApp.app.storageController.getStoredCategories(function(categories) {
                    if(typeof categories[element.bodyElement.dom.nodeId] === 'undefined') {
                            element.bodyElement.down('.greenChecker').addCls('invisible');
                    } else  element.bodyElement.down('.greenChecker').removeCls('invisible');
                });
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
            LernApp.app.storageController.getStoredCategories(function(categories) {
                var cat = element.bodyElement.dom.nodeId;
               
                if(editMode) {
                    if(typeof categories[cat] === 'undefined') {
                        element.addCls('addIcon');
                        element.removeCls('deleteIcon');
                    }
                    else {
                        element.addCls('deleteIcon');
                        element.removeCls('addIcon');
                    }
                    
                    if(element.getRecord().get('leaf')) {
                        element.bodyElement.down('.redbadgeicon').addCls('invisible');
                    }
                    
                    element.bodyElement.down('.greenChecker').addCls('invisible');
                }
                else {
                    element.removeCls('addIcon');
                    element.removeCls('deleteIcon');
                    
                    if(element.getRecord().get('leaf')) {
                        element.bodyElement.down('.redbadgeicon').removeCls('invisible');
                    }
                    
                    LernApp.app.storageController.getStoredCategories(function(categories) {
                        if(typeof categories[cat] === 'undefined') {
                            element.bodyElement.down('.greenChecker').addCls('invisible');
                        }   else element.bodyElement.down('.greenChecker').removeCls('invisible');
                    });
                }
            });
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
            Ext.Viewport.setMasked({xtype:'loadmask', message:'Lade Fragen'});
            me.fireEvent('leafitemtap', this, list, index, target, record, e);
            me.goToLeaf(node);

            LernApp.app.storageController.getStoredTest(node.getId(), function(questions) {
                var panel = Ext.create('LernApp.view.learncard.CardCarousel', { 
                    questions: questions,
                    showOnlyQuestion: true
                });
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
     * Adding/removing selected listItem and it's children to/from app database
     * 
     * @param {Ext.data.NodeInterface} node The selected node (listItem).
     */
    performEditOnItem: function(node) {
        var me = this,
            leaf = node.isLeaf(),
            category = node.getData().id,
            parentId = node.parentNode.getData().id,
            listDepth = node.parentNode.getData().depth;
            
        var categoryModification = {
            added: new Object(),
            deleted: new Object()
        }

        LernApp.app.storageController.getStoredCategories(function(categories) {
            if(typeof categories[category] === 'undefined') {
                Ext.Viewport.setMasked({xtype:'loadmask', message:'Lade...'});
                categoryModification.added[category] = { leaf: leaf, 
                    parent: listDepth > 0 ? parentId : listDepth
                };
                categoryModification = me.performEditOnChildItem(node.childNodes, categoryModification, false);
            } 
            else {
                Ext.Viewport.setMasked({xtype:'loadmask', message:'Lösche...'});
                categoryModification.deleted[category] = { leaf: leaf, 
                    parent: listDepth > 0 ? parentId : listDepth
                };
                categoryModification = me.performEditOnChildItem(node.childNodes, categoryModification, true);
            }
            
            LernApp.app.storageController.removeStoredCategories(categoryModification.deleted, function() {
                LernApp.app.storageController.addStoredCategories(categoryModification.added, function() {
                    LernApp.app.storageController.storeQuestions(categoryModification.added, function() {
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
                category = element.getData().id,
                parentId = element.parentNode.getData().id;
            
            if(!deleteFlag) categoryModification.added[category] = { parent: parentId, leaf: leaf };
            else categoryModification.deleted[category] = { parent: parentId, leaf: leaf };
            
            if(!leaf) {
                categoryModification = me.performEditOnChildItem(
                        element.childNodes, categoryModification, deleteFlag);
            }
        });
        
        return categoryModification;
    }
});
