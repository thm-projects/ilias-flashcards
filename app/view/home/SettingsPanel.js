/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/SettingsPanel.js
  - Beschreibung:	Einstellungsseite der Applikation. 
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

Ext.define('LearningApp.view.home.SettingsPanel', {
    extend: 'Ext.Panel',
    xtype: 'settingsPanel',

    requires: [
        'Ext.Img',
        'Ext.Button',
        'Ext.Panel',
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.form.Panel'
    ],
    
    config: {
        title: Messages.SETTINGS,
        scrollable: null,
        iconCls: 'settings',
        id: 'settingsPanel',
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;
        
        this.controller = LearningApp.app.storageController;
        
        this.backButton = Ext.create('Ext.Button', {
            text: Messages.HOME,
            align: 'left', 
            ui: 'back',
            handler : function(button) {
                LearningApp.app.main.tabPanel.animateActiveItem(0, {
                    type: 'slide', 
                    direction: 'right'
                });
            }
        });
        
        this.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: Messages.SETTINGS,
            items: [this.backButton]
        });

        this.logoutButton = Ext.create('Ext.Button' , {
            text: Messages.USER_LOGOUT,
            handler: this.logoutHandler
        });
        
        this.deleteDataButton = Ext.create('Ext.Button', {
            ui: 'decline',
            text: Messages.DELETE_DATA,
            handler: this.deleteDataHandler
        });
        
        this.buttonContainer = Ext.create('Ext.form.Panel', {
           scrollable: null,
           items: [{
              xtype: 'fieldset',
              cls: 'form',
              title: Messages.USER_LOGOUT_FORM,
              items: [this.logoutButton]
           }, {
               xtype: 'fieldset',
               cls: 'form',
               title: Messages.DELETE_ALL_USER_DATA,
               items: [this.deleteDataButton]
           }]
        });

        this.logo = Ext.create('Ext.Img', {
            mode: 'image',
            cls: 'appLogo',
            style: {
                'margin-top': '20px',
                'margin-bottom': '10px'
            },
            src: 'resources/icons/logo.png'
        });

        this.add([
            this.titleBar,
            this.logo,
            this.buttonContainer
        ]);

        this.onAfter('initialize', this.onInitialize);
    },
    
    /**
     * actions to perform on initialization
     */
    onInitialize: function() {

    },

    logoutHandler: function () {
        Ext.Msg.confirm(Messages.CONFIRM_LOGOUT_TITLE, Messages.CONFIRM_LOGOUT, function (answer) {
            if (answer === 'yes') {
                LearningApp.app.getController('LoginController').logout();
            }
        });
    },

    deleteDataHandler: function () {
        Ext.Msg.confirm(Messages.CONFIRM_LOGOUT_TITLE, Messages.CONFIRM_DELETE_LOGOUT, function (answer) {
            if (answer === 'yes') {
                LearningApp.app.storageController.deleteUserData();
            }
        });
    }
});
