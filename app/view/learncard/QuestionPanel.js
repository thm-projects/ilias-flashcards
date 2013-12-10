/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/learncard/QuestionPanel.js
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

Ext.define('LernApp.view.learncard.QuestionPanel', {
    extend: 'Ext.Panel',
    xtype: 'questionPanel',

    requires: [
        'LernApp.prototype.CustomMask'
    ],
    
    config: {
        title: Messages.QUESTION,
        scrollable: 'vertical',
        fullscreen: true
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        this.questionTitle = Ext.create('Ext.Panel', {
            cls: 'roundedBox',
            html: 
                '<p class="title">' + Ext.util.Format.htmlEncode('01. Drei-Elemente-Lehre') + '<p/><br>' +
                '<p>' + Ext.util.Format.htmlEncode('Worüber lässt sich anhand der auf Georg Jellinek zurückgehenden sogenannter Drei-Elemente-Lehre eine Aussage treffen?') + '</p>'
        });
        
        this.answerList = Ext.create('Ext.List', {            
            cls: 'roundedBox',  
            scrollable: { disabled: true },
            
            data: [
                { text: 'Über den Stand der europäischen Integration.' },
                { text: 'Über das Vorliegen eines Staates.' },
                { text: 'Über das Vorliegen eines Staatenverbundes.' },
                { text: 'Über das Legitimationsniveau in der EU.' }
            ],
            
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
        
        this.add([
            this.questionTitle,
            this.answerList
        ]);
    },
    
    /**
     * disables this panel and set a mask as overlay
     */
    disableQuestion: function() {
        this.unmask();
        this.setDisabled(true);
        this.mask(Ext.create('LernApp.prototype.CustomMask'));
    }
});
