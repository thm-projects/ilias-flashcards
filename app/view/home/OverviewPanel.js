/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/OverviewPanel.js
  - Beschreibung:	Übersichtsseite der Applikation. 
  - Datum:			28.11.2013
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

Ext.define('LearningApp.view.home.OverviewPanel', {
    extend: 'Ext.Panel',
    xtype: 'overviewPanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LearningApp.view.home.TestOverviewPanel',
        'LearningApp.view.flashcard.CardCarousel',
        'LearningApp.view.cardindex.CardIndex',
        'LearningApp.view.flashcard.FlashcardBox'
    ],
    
    config: {
        title: Messages.OVERVIEW,
        scrollable: true,
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;
        
        this.continueButton = Ext.create('Ext.Button', {
            text: Messages.CONTINUE,
            scrollable: true,
            ui: 'confirm',
            handler: function() {

            }
         });

        this.messageBox = Ext.create('Ext.MessageBox', {
            title: 'Willkommen',
            message: Messages.PLEASE_CHOOSE,
            buttons: [{
                xtype: 'button',
                text: 'OK',
                handler: function() {
                    me.messageBox.hide();
                }
            }]
        });
        
        this.flashcardFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.LEARNING,
            cls: 'standardForm',
            width: '300px',
            style: 'margin-top: 0px',
            
            items: [
                {
                    xtype   : 'button',
                    name    : 'flashcards',
                    text    : Messages.FLASHCARD_BOX,
                    cls     : 'forwardListButton',
                    disabled: false,
                    handler : function() {
                        LearningApp.app.storageController.getFlashcardObject(function(flashcardObject) {
                            var panel = Ext.create('LearningApp.view.flashcard.FlashcardBox', {
                                flashcardObject: flashcardObject
                            });
                            LearningApp.app.main.navigation.push(panel);
                        });
                        
                    } 
                }, {
                    xtype   : 'button',
                    name    : 'showCards',
                    text    : Messages.SHOW_FLASHCARDS,
                    cls     : 'forwardListButton',
                    pressedDelay: 100,
                    handler : function() {
                        var button = this;
                        button.disable();
                        LearningApp.app.storageController.getStoredSelectedTests(function(testObj) {
                            if(Object.keys(testObj).length == 0) {
                                me.messageBox.show();
                                button.enable();
                            } else {
                                LearningApp.app.setMasked('Lade Fragen', function() {
                                    var panel = Ext.create('LearningApp.view.home.TestOverviewPanel', {
                                        testObj: testObj
                                    });
                                    LearningApp.app.main.navigation.push(panel);
                                    Ext.Viewport.setMasked(false);
                                });
                            }
                        });
                    }
                }, {
                    xtype   : 'button',
                    name    : 'randomCards',
                    text    : Messages.SHOW_RANDOM_CARDS,
                    cls     : 'forwardListButton',
                    handler : function() {
                        var button = this;
                        button.disable();
                        LearningApp.app.storageController.getRandomSetofStoredQuestions(function(questions) {
                            if(Object.keys(questions).length == 0) {
                                me.messageBox.show();
                                button.enable();
                            } else {
                                LearningApp.app.setMasked('Lade Fragen', function() {
                                    var panel = Ext.create('LearningApp.view.flashcard.CardCarousel', { 
                                        testMode: true,
                                        questions: questions,
                                        showOnlyQuestion: false
                                    });
                                    LearningApp.app.main.navigation.push(panel);
                                });
                            }
                        });
                    }
                }
            ]
        });
        
        this.cardIndexFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.CARD_INDEX,
            cls: 'standardForm',
            width: '300px',
            style: 'margin-top: 0px',
            
            items: [
                {
                    xtype   : 'button',
                    name    : 'showCardIndex',
                    text    : Messages.EDIT_CARD_INDEX,
                    cls     : 'forwardListButton',
                    handler : function() {
                        var button = this;
                        button.disable();
                        LearningApp.app.setMasked('Lade Fragen', function() {
                            var panel = Ext.create('LearningApp.view.cardindex.CardIndex', {view: 'test'});
                            LearningApp.app.main.navigation.push(panel);
                        });
                    }
                }, {
                    xtype   : 'button',
                    name    : 'showCategoryIndex',
                    text    : Messages.EDIT_CATEGORYS_INDEX,
                    cls     : 'forwardListButton',
                    handler : function() {
                        var button = this;
                        button.disable();
                        LearningApp.app.setMasked('Lade Fragen', function() {
                            var panel = Ext.create('LearningApp.view.cardindex.CardIndex');
                            LearningApp.app.main.navigation.push(panel);
                        });
                    }
                }
            ]
        });
        
        this.add([
            this.flashcardFieldSet,
            this.cardIndexFieldSet
        ]);
        
        /**
         * show logout button when panel is activated
         */
        this.onAfter('painted', function() {
            LearningApp.app.main.navigation.logoutButton.show();
            
            this.flashcardFieldSet.getInnerItems().forEach(function(item) {
                item.enable();
            });
            
            this.cardIndexFieldSet.getInnerItems().forEach(function(item) {
                item.enable();
            });
            
        });
        
        /**
         * hide logout button when panel is deactivated
         */
        this.on('deactivate', function() {
            LearningApp.app.main.navigation.logoutButton.hide();
        });
    }
});
