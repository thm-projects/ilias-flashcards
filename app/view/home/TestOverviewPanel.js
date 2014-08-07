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
        
Ext.define('LernApp.view.home.TestOverviewPanel', {
    extend: 'Ext.Panel',
    xtype: 'testOverviewPanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LernApp.view.learncard.CardCarousel',
        'LernApp.view.cardindex.CardIndex'
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
            width: '310px',
            style: 'margin-top: 20px',
        });
        
        this.add([
            this.cardIndexFieldSet
        ]);
        
        this.initializeTestButtons();
    },
    
    initializeTestButtons: function() {
        var me = this;
        
        for(var key in this.testObj) {
            me.cardIndexFieldSet.add({
                xtype   : 'button',
                name    : me.testObj[key].title,
                text    : me.testObj[key].title,
                itemId  : key,
                cls     : 'forwardListButton', 
                handler : function(obj) {
                    LernApp.app.setMasked('Lade Fragen', function() {
                        LernApp.app.storageController.getStoredQuestions(obj.getItemId(), function(questions) {
                            var panel = Ext.create('LernApp.view.learncard.CardCarousel', { 
                                questions: questions,
                                showOnlyAnswers: true,
                                showOnlyQuestion: false
                            });
                            LernApp.app.main.navigation.push(panel);
                        });
                    });
                }
            });
        }
    }
});
