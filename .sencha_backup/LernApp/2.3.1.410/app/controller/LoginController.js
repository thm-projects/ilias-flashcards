/*--------------------------------------------------------------------------------+
  - Dateiname:      app/controller/LoginController.js
  - Beschreibung:   Login-Controller
  - Datum:          28.12.2014
  - Autor(en):      Andreas Gärtner <andreas.gaertner@hotmail.com>
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
Ext.define('LernApp.controller.LoginController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            
        },
        control: {
            
        }
    },
    
    /**
     * Login handler. Tries to connect to specified server application
     * and performs steps on success or failure.
     * 
     * @param: uname - entered username
     * @param: upass - entered password
     * @param: loginPanel - panel where login credentials have been entered
     */
    login: function(uname, upass, loginPanel) {
        var me = this;
        
        LernApp.app.proxy.login(uname, upass, {
            success: function(responseObj) {                
                LernApp.app.storageController.setLoggedInUser(uname, responseObj, function() {
                    LernApp.app.proxy.setDefaultHeaders(responseObj);
                    var navigation = Ext.create('LernApp.view.home.HomeNavigation');
                    LernApp.app.getController('Navigation').changeNavigation(navigation);
                    Ext.Viewport.setMasked(false);
                });
            },         
            failure: function() {
                LernApp.app.proxy.check({
                    success: function() {
                        loginPanel.markLoginFieldSet();
                    },
                    failure: function() {
                        Ext.Msg.alert('', Messages.CONNECTION_ERROR, Ext.emptyFn);
                    },
                    callback: function() {
                        loginPanel.enableConfirmButton();
                        Ext.Viewport.setMasked(false);
                    }
                });
            }
        });
    },
    
    checkLogin: function(promise) {
        if(LernApp.app.storageController.isUserLoggedIn()) {
            LernApp.app.storageController.initializeSession();
            LernApp.app.proxy.checkLogin();
            promise(true);
        } 
        else promise(false);
    },
    
    /**
     * Logout handler. Performs action required for a logout.
     */
    logout: function() {
        LernApp.app.storageController.removeLoggedInUser(function() {
            LernApp.app.proxy.resetDefaultRequestHeaders();
            var navigation = Ext.create('LernApp.view.login.LoginNavigation');
            LernApp.app.getController('Navigation').changeNavigation(navigation, true);
            localStorage.removeItem('login');
            Ext.Viewport.setMasked(false);
        });
    }
});
