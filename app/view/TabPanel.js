/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/TabPanel.js
  - Beschreibung:	TabPanel Prototyp. 
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

Ext.define('LernApp.view.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'TabPanel',
    
    config: {
        autoDestroy: true,
        tabBarPosition: 'bottom',
        
        layout: {
            type: 'card',
            animation: {
                duration: 600,
                easing: 'ease-in-out',
                type: 'slide',
                direction: 'left'
            }
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
    },
    
    /**
     * unhides all tab panels
     */
    showAllTabs: function() {
        this.getItems().items.forEach(function(element, index, array) {
            if(index != 0) element.tab.show();
        });
    },
    
    /**
     * hides forwarded tab panel (tab) 
     * 
     * @param: tab panel to hide
     */
    hideTab: function(tab) {
        this.getItems().items.forEach(function(element, index, array) {
            if(tab == element) {
                element.tab.hide();
            }
        });
    },
    
    /**
     * hide all tab panels
     */
    hideAllTabs: function() {
        this.getItems().items.forEach(function(element, index, array) {
            if(index != 0) element.tab.hide();
        });
    },
    
    /**
     * insert panel to tabPanel on next-to-last position
     * 
     * @param: tab panel to insert
     */
    addBeforeLastTab: function(tab) {
        var lastIndex = LernApp.app.main.tabPanel.getInnerItems().length - 1;

        LernApp.app.main.tabPanel.insert(lastIndex, tab);
    }
});
