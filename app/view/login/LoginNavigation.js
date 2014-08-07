/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/login/LoginNavigation.js
  - Beschreibung:	Navigation-Instanz für den Login. 
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

Ext.define('LernApp.view.login.LoginNavigation', {
    extend: 'LernApp.prototype.NavigationView',
    xtype: 'loginNav',

    requires: [
        'LernApp.view.login.WelcomePanel',
        'LernApp.view.login.LoginPanel'
    ],
    
    config: {
        title: Messages.HOME
    },
    
    instanciateComponents: function() {
        this.loginPanel = Ext.create('LernApp.view.login.LoginPanel')
        this.welcomePanel = Ext.create('LernApp.view.login.WelcomePanel');
    },
    
    initialize: function() {
        this.callParent(arguments);
        this.instanciateComponents();
        
        this.push(this.welcomePanel);

        this.on('destroy', this.onDestroy);
    },
    
    afterNavigationChange: function() {
        this.push(this.loginPanel);
    },
    
    onDestroy: function() {
        this.loginPanel.destroy();
        this.welcomePanel.destroy();
    }
});
