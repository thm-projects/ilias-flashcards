/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/flashcard/QuestionPanel.js
  - Beschreibung:	QuestionPanel. 
  - Datum:			25.11.2013
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

Ext.define('LearningApp.view.flashcard.QuestionPanel', {
    extend: 'Ext.Panel',
    xtype: 'questionPanel',

    requires: [
        'LearningApp.prototype.CustomMask'
    ],
    
    config: {
        title: Messages.QUESTION,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    
    initialize: function() {
        this.callParent(arguments);

        this.questionTitle = Ext.create('Ext.Panel', {
            cls: 'roundedBox',
            html: 
                '<p class="title">' + Ext.util.Format.htmlEncode(this.config.questionObj.title) + 
                '<p/><br>' + this.config.questionObj.text
        });
        
        this.answerList = Ext.create('Ext.List', {            
            cls: 'roundedBox',  
            scrollable: { disabled: true },
            
            data: this.config.questionObj.answers,
            mode: this.config.questionObj.type === 2 ? 'MULTI': 'SINGLE',
            
            listeners: {
                scope: this,
                /**
                 * The following events are used to get the computed height of all list items and 
                 * finally to set this value to the list DataView. In order to ensure correct rendering
                 * it is also necessary to get the properties "padding-top" and "padding-bottom" and 
                 * add them to the height of the list DataView.
                 */
                painted: function (list, eOpts) {
                    this.answerList.fireEvent("resizeList", list);
                },
                resizeList: function(list) {
                    var listItemsDom = list.select(".x-list .x-inner .x-inner").elements[0];
                    
                    this.answerList.setHeight(
                        parseInt(window.getComputedStyle(listItemsDom, "").getPropertyValue("height"))  + 
                        parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-top")) +
                        parseInt(window.getComputedStyle(list.dom, "").getPropertyValue("padding-bottom"))
                    );
                }
            }
        });
        
        this.onAfter('activate', function() {
            var me = this;
            
            if(window.innerWidth < 340) {
                var title = this.config.questionObj.type === 2 ? 'Multiple Ch.' : 'Single Ch.';
            } else {
                var title = this.config.questionObj.type === 2 ? 'Multiple Choice' : 'Single Choice';
            }
            
            Ext.create('Ext.util.DelayedTask', function() {
                if(!me.config.showOnlyQuestion) LearningApp.app.main.cardCarousel.answerButton.show();
                if(me.isAnswered) LearningApp.app.main.cardCarousel.answerButton.hide();
                LearningApp.app.main.navigation.getNavigationBar().setTitle(title); 
            }).delay(1);
        });
        
        this.add([
            this.questionTitle,
            this.answerList
        ]);
    }
});
