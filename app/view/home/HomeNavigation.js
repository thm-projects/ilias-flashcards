/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/HomeNavigation.js
  - Beschreibung:	Navigationsobjekt des Home-Bereichs. 
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

Ext.define('LernApp.view.home.HomeNavigation', {
    extend: 'LernApp.prototype.NavigationView',
    xtype: 'homeNav',

    requires: [
        'LernApp.view.home.OverviewPanel',
        'Ext.util.DelayedTask'
    ],
    
    config: {
        title: Messages.HOME
    },
    
    initialize: function() {
        this.callParent(arguments);

        this.logoutButton = Ext.create('Ext.Button', {
            text    : Messages.LOGOUT,
            cls     : 'confirmGreen',
            ui      : 'back',
            align   : 'left',
            hidden  : true,
            handler : function() {
                LernApp.app.getController('Navigation').changeNavigation(
                        Ext.create('LernApp.view.login.LoginNavigation'), true
                );
            }
        });
        
        /**
         * add logout button to navigationBar
         */
        this.getNavigationBar().add(this.logoutButton);
        
        /**
         * initialize listeners
         */
        this.on('initialize', this.onInitialize);
        this.on('destroy', this.onDestroy);
    },
    
    /**
     * actions to fulfill after navigation change (Navigation controller)
     */
    afterNavigationChange: function() {
        this.push(Ext.create('LernApp.view.home.OverviewPanel'));
    },
    
    /**
     * actions to fulfill on initialization
     */
    onInitialize: function() {
        LernApp.app.main.tabPanel.addBeforeLastTab(
                Ext.create('LernApp.view.home.UserPanel')
        );
        
        LernApp.app.main.tabPanel.addBeforeLastTab(
                Ext.create('LernApp.view.home.SettingsPanel')
        );
    },
    
    /**
     * actions to fulfill on panel destroy
     */
    onDestroy: function() {
        var userPanel = LernApp.app.main.tabPanel.down('#userPanel');
        var settingsPanel = LernApp.app.main.tabPanel.down('#settingsPanel');
        
        LernApp.app.main.tabPanel.hideTab(userPanel);
        LernApp.app.main.tabPanel.hideTab(settingsPanel);
        
        LernApp.app.main.tabPanel.remove(userPanel);
        LernApp.app.main.tabPanel.remove(settingsPanel);
    }
});
