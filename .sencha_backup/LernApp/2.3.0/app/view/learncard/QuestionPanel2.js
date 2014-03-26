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

Ext.define('LernApp.view.learncard.QuestionPanel2', {
    extend: 'Ext.Panel',
    xtype: 'questionPanel2',

    requires: [
        'LernApp.prototype.CustomMask'
    ],
    
    config: {
        id: 'questionPanel2',
        title: Messages.QUESTION,
        fullscreen: true,
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
                '<p class="title">' + Ext.util.Format.htmlEncode('02. EP degr. Proportionalität') + '<p/><br>' +
                '<p>' + Ext.util.Format.htmlEncode('Die Sitze im Europäischen Parlament sind in mitgliedstaatliche Kontingente gegliedert, deren Größe sich nach dem Grundsatz der degressiven Proportionalität richtet. Dies bedeutet, dass mit wachsender Bevölkerungsgröße die Zahl zusätzlicher Sitze pro Kontingent geringer wird, womit auf einen Abgeordneten aus dem deutschen Kontingent im Ergebnis etwa zwölfmal so viele Wähler kommen wie auf einen maltesischen Abgeordneten.') + '<br><br>' + Ext.util.Format.htmlEncode('Seit dem Beschluss des Rats 2002/772/EG, der den Direktwahlakt geändert hat, erfolgen die Wahlen dieser Kontingente allerdings in allen Mitgliedstaaten nach dem Verhältniswahlsystem. Vorher war es den Mitgliedstaaten überlassen, ihr Kontingent in einer Mehrheitswahl wählen zu lassen.') + '<br><br>' + Ext.util.Format.htmlEncode('Welche Bedeutung hat die degressive Proportionalität für die Verwirklichung der Grundsätze einer allgemeinen, unmittelbaren, gleichen, freien und geheimen Wahl?') + '</p>'
        });
        
        this.answerList = Ext.create('Ext.List', {            
            cls: 'roundedBox',  
            scrollable: { disabled: true },
            
            data: [
                { text: 'Die Wahlen sind unmittelbar, frei und geheim, aber weder allgemein noch gleich.' },
                { text: 'Keine - sämtliche Wahlgrundsätze werden unabhängig von der degressiv proportionalen Kontingentierung bei der EP-Wahl verwirklicht.' },
                { text: 'Die Wahlen sind allgemein, unmittelbar, frei und geheim - vollkommen gleich aber sind sie erst, seit überall nach Verhältniswahl gewählt wird.' },
                { text: 'Die Wahlen sind allgemein, unmittelbar, frei und geheim, aber auch nach Vereinheitlichung hin zur Verhältniswahl nicht gleich.' }
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
