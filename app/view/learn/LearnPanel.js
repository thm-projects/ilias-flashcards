/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/learn/OverviewPanel.js
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
        
Ext.define('LernApp.view.learn.LearnPanel', {
    extend: 'Ext.Panel',
    xtype: 'learnPanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LernApp.prototype.CustomButton'
    ],
    
    config: {
        title: Messages.LEARNOVERVIEW,
        scrollable: true,
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        
        this.learnCardFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.FLASHCARD_BOXES,
            cls: 'standardForm flashCardFieldSet',
        
            defaults: {
                xtype: 'customButton',
                cls: 'forwardListButton',
                handler: function(button) {
                    
                }
            },
            
            items: [
                {
                    text: Messages.FLASHCARD_BOX5,
                    subText: Messages.FLASHCARD_LEARNED,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    text: Messages.FLASHCARD_BOX4,
                    subText: Messages.FLASHCARD_EASY,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    text: Messages.FLASHCARD_BOX3,
                    subText: Messages.FLASHCARD_COULD_BE_WORSE,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    text: Messages.FLASHCARD_BOX2,
                    subText: Messages.FLASHCARD_DIFFICULT,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }, {
                    text: Messages.FLASHCARD_BOX1,
                    subText: Messages.FLASHCARD_NOTEDITED,
                    badgeCls: 'badgeicon badgefixed_button',
                    badgeText: '0'
                }
            ]
        });
        
        this.add([this.learnCardFieldSet]);
    }
});
