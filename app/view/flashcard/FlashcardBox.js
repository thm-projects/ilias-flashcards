/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/flashcard/FlashcardBox.js
  - Beschreibung:	Übersicht über alle selektierten Tests. 
  - Datum:			15.05.2014
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
        
Ext.define('LearningApp.view.flashcard.FlashcardBox', {
    extend: 'Ext.Panel',
    xtype: 'flashcardBox',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LearningApp.prototype.SubTextButton'
    ],
    
    config: {
        title: Messages.FLASHCARD_BOX,
        scrollable: true,
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        var me = this;
        
        this.flashcardFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.FLASHCARD_BOXES,
            cls: 'standardForm flashCardFieldSet',
            
            defaults: {
                xtype: 'subTextButton',
                cls: 'forwardListButton',
                handler: function(button) {
                    var questionIds = me.config.flashcardObject[button.getItemId()];
                    
                    if(Object.keys(questionIds).length > 0) {
                        me.disableAllButtons();
                        me.prepareTest(questionIds, button.getItemId());
                    }
                }
            },
            
            items: [
                {
                    itemId: 'box5',
                    text: Messages.FLASHCARD_BOX5,
                    subText: Messages.FLASHCARD_LEARNED,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    itemId: 'box4',
                    text: Messages.FLASHCARD_BOX4,
                    subText: Messages.FLASHCARD_EASY,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    itemId: 'box3',
                    text: Messages.FLASHCARD_BOX3,
                    subText: Messages.FLASHCARD_COULD_BE_WORSE,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    itemId: 'box2',
                    text: Messages.FLASHCARD_BOX2,
                    subText: Messages.FLASHCARD_DIFFICULT,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    itemId: 'box1',
                    text: Messages.FLASHCARD_BOX1,
                    subText: Messages.FLASHCARD_NOTEDITED,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }
            ]
        });
        
        this.add([
            { xtype: 'spacer'}, 
            this.flashcardFieldSet,
            { xtype: 'spacer', width: 'auto', flex: 5}
        ]);
        this.onBefore('painted', this.updateBadges);
    },
    
    updateBadges: function() {
        var me = this,
            buttons = this.flashcardFieldSet.getInnerItems();
        
        buttons.forEach(function(button) {
            var flashcardBox = me.config.flashcardObject[button.getItemId()];
            var length = String(Object.keys(flashcardBox).length);
            button.setBadgeText(length);
            button.enable();
        });
    },
    
    updateFlashcardObject: function(flashcardObject) {
        this.config.flashcardObject = flashcardObject;
    },

    disableAllButtons: function() {
        this.flashcardFieldSet.getInnerItems().forEach(function(button) {
            button.disable();
        });
    },
    
    prepareTest: function(questionIds, boxId) {
        var index = 0,
            testData = new Array();
        
        LearningApp.app.setMasked('Lade Fragen', function() {
            LearningApp.app.storageController.getStoredTestObject(function(tests) {
                for(var test in tests) {
                    Object.keys(tests[test].questions).map(function(question) {
                        if(typeof questionIds[question] !== "undefined") {
                            testData.push(tests[test].questions[question]);
                        }
                    });
                };
                
                var panel = Ext.create('LearningApp.view.flashcard.CardCarousel', {
                    boxId: boxId,
                    questions: testData,
                    showOnlyAnswers: false,
                    showOnlyQuestion: false
                });
                LearningApp.app.main.navigation.push(panel);
            });
        });
    }
});
