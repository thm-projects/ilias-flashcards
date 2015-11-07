/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/TestOverviewPanel.js
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
        
Ext.define('LearningApp.view.home.TestOverviewPanel', {
    extend: 'Ext.Panel',
    xtype: 'testOverviewPanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LearningApp.view.flashcard.CardCarousel',
        'LearningApp.view.cardindex.CardIndex'
    ],
    
    config: {
        title: Messages.TESTOVERVIEW,
        scrollable: true,
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;

        this.cardIndexFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.CARD_INDEX,
            cls: 'standardForm',
            style: 'margin-top: 20px'
        });
        
        this.add([
            this.cardIndexFieldSet
        ]);
        
        this.initializeTestButtons();
    },
    
    initializeTestButtons: function() {
        var me = this,
            testObj = this.config.testObj;
        
        for(var key in this.config.testObj) {
            me.cardIndexFieldSet.add({
                xtype: 'subTextButton',
                name: testObj[key].title,
                text: testObj[key].title,
                badgeText: testObj[key].questionCount,
                badgeCls: 'badgeicon badgefixed_button',
                itemId: key,
                cls: 'forwardListButton', 
                handler : function(obj) {
                    LearningApp.app.setMasked('Lade Fragen', function() {
                        LearningApp.app.storageController.getStoredQuestions(obj.getItemId(), function(questions) {
                            var panel = Ext.create('LearningApp.view.flashcard.CardCarousel', {
                                testMode: true,
                                questions: questions,
                                showOnlyQuestion: false
                            });

                            LearningApp.app.main.navigation.push(panel);
                        });
                    });
                }
            });
        }
    }
});
