/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/MainContainer.js
  - Beschreibung:	Startseite der Applikation. 
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

Ext.define('LernApp.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',

    requires: [
       'LernApp.view.TabPanel'
    ],
    
    config: {
        autoDestroy: true,
        layout: 'hbox',
        defaults: {
            flex: 1
        }
    },
    
    instanciateComponents: function() {
        this.tabPanel = Ext.create('LernApp.view.TabPanel');
        this.aboutPanel = Ext.create('LernApp.view.about.AboutPanel');
    },
    
    initialize: function() {
        this.callParent(arguments);
        this.instanciateComponents();
    },
    
    initializeComponents: function(loginState) {
        /** determine the navigation to loaded */    
        if(!loginState) {
            this.navigation = Ext.create('LernApp.view.login.LoginNavigation');
        } else {
            this.navigation = Ext.create('LernApp.view.home.HomeNavigation');
        }
        
        /** add panels to tabpanel and show them */
        this.tabPanel.addItem(this.aboutPanel);
        this.tabPanel.addItem(this.navigation);
        this.tabPanel.setActiveItem(this.navigation);
        
        /** add tabPanel to main view */
        this.add([this.tabPanel]);  
    }
});
