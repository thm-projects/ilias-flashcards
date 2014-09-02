/*--------------------------------------------------------------------------------+
  - Dateiname:		/app.js
  - Beschreibung:	Einstieg für die Applikation. 
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

  Dieses Programm ist freie Software. Sie können es unter den Bedingungen der GNU 
  General Public License, wie von der Free Software Foundation veröffentlicht,
  weitergeben und/oder modifizieren, entweder gemäß Version 3 der Lizenz oder 
  jeder späteren Version.
  +--------------------------------------------------------------------------------+
  Die Veröffentlichung dieses Programms erfolgt in der Hoffnung, daß es Ihnen von
  Nutzen sein wird, aber OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie
  der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN BESTIMMTEN ZWECK. Details finden
  Sie in der GNU General Public License.
  Sie sollten ein Exemplar der GNU General Public License zusammen mit diesem 
  Programm erhalten haben. Falls nicht, siehe <http://www.gnu.org/licenses/>.
  +--------------------------------------------------------------------------------+
*/

Ext.application({
    name: 'LernApp',
    appFolder: 'app',

    requires: [
        'LernApp.view.Main',
        'LernApp.proxy.Proxy',
        'LernApp.prototype.CustomMessageBox'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',		// Retina iPhone
        '144': 'resources/icons/Icon~ipad@2x.png'	// Retina iPad
    },

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',	// Retina iPhone
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',	// Retina iPad, Portrait
        '1496x2048': 'resources/startup/1496x2048.png'	// Retina iPad, Landscape
    },

    models: [
        'CardIndexModel',
        'Category',
        'Question'
    ],
        
    stores: [
        'CardIndexStore',
        'QuestionStore'
    ],
    
    controllers: [
        'Navigation',
        'LoginController',
        'AnswerController',
        'StorageController'
    ],
    
    fullscreen: true,
    isIconPrecomposed: true,
    statusBarStyle: 'default',
    
    /**
     * app configuration
     */
    daysUntilReloadData:    7,
    daysUntilLoginExpires:  14,
    randomQuestionCount:    10,
    
    launch: function() {    
        var me = this;
        
        /** destroy loading indicator */
        Ext.fly('appLoadingIndicator').destroy();
        
        this.storageController = this.getController('StorageController');
        this.proxy = Ext.create('LernApp.proxy.Proxy');
        this.main = Ext.create('LernApp.view.Main');
        
        this.getController('LoginController').checkLogin(function(loginState) {
            me.main.initializeComponents(loginState);
            Ext.Viewport.add(me.main);
        });
    },
    
    setMasked: function(message, promise) {
        Ext.Viewport.setMasked({xtype:'loadmask', message: message});
        Ext.create('Ext.util.DelayedTask', promise, this).delay(1);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Update",
             "Diese Applikation wurde erfolgreich auf die neuste Version aktualisiert. Möchten Sie die App neustarten?",
             function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
