/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/login/LoginPanel.js
  - Beschreibung:	Login der Applikation. 
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

Ext.define('LearningApp.view.login.LoginPanel', {
    extend: 'Ext.Panel',
    xtype: 'loginPanel',

    requires: [        
        'Ext.field.Email',
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'LearningApp.view.home.HomeNavigation'
    ],
    
    config: {
        title: Messages.LOGIN,
        scrollable: true,
        
        layout: {
            type: 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;
        
        this.loginFieldSet = Ext.create('Ext.form.FieldSet', {
            instructions: Messages.LOGIN_DATA,
            width: '300px',
            style: 'margin-bottom: 15px',
            
            items: [
                {
                    xtype   : 'emailfield',
                    name    : 'username',
                    itemId  : 'username',
                    cls     : 'loginFields',
                    placeHolder: Messages.USERNAME,
                    listeners: {
                        action: function() {
                            me.loginFieldSet.getInnerItems()[1].focus();
                        },
                        focus: function () {
                            var tP = LearningApp.app.main.tabPanel;
                            me.hideTabBarOnMobile();
                            if (Ext.os.deviceType === 'Phone' && !tP.getTabBar().isHidden()) {
                                Ext.defer(function () {
                                    me.getScrollable().getScroller().scrollBy(0, 100, true);
                                }, 750);
                            }
                        },
                        blur: me.showTabBar
                    }
                }, {
                    xtype   : 'passwordfield',
                    name    : 'password',
                    itemId  : 'password',
                    cls     : 'loginFields',
                    placeHolder: Messages.PASSWORD,
                    listeners: {
                        action: function() {
                            me.confirmButton.config.handler(
                                me.confirmButton
                            );
                        },
                        focus: me.hideTabBarOnMobile,
                        blur: me.showTabBar
                    }
                }
            ]
        });
        
        this.confirmButton = Ext.create('Ext.Button', {
            text    : 'Anmelden',
            ui      : 'confirm',
            style   : 'overflow: visible',
            handler : function(button) {
                button.disable();
                Ext.Viewport.setMasked({ xtype:'loadmask', message: Messages.LOADING });
                var fieldsetItems = me.loginFieldSet.getInnerItems();
                LearningApp.app.getController('LoginController').login(
                    fieldsetItems[0].getValue(), 
                    fieldsetItems[1].getValue(), me
                );
            }
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
        
        this.on('painted', function () {
            LearningApp.app.appLoadingFinished = true;
        });
        
        this.add([{
            xtype: 'spacer',
            width: 'auto',
            flex: 1
        }, this.logo, {
            xtype: 'spacer',
            width: 'auto',
            flex: 1
        }, this.loginFieldSet,
        this.confirmButton, {
            xtype: 'spacer',
            width: 'auto',
            flex: 8
        }]);
    },

    hideTabBarOnMobile: function () {
        if (Ext.os.deviceType === 'Phone') {
            LearningApp.app.dontShowTabBar = true;
            Ext.defer(function () {
                LearningApp.app.main.tabPanel.getTabBar().setHidden(true);
                LearningApp.app.dontShowTabBar = false;
            }, 50);
        }
    },

    showTabBar: function () {
        Ext.defer(function () {
            if (!LearningApp.app.dontShowTabBar) {
                LearningApp.app.main.tabPanel.getTabBar().setHidden(false);
            }
        }, 50);
    },

    /** enables confirm button */
    enableConfirmButton: function() {
        this.confirmButton.enable();
    },
    
    /** mark placeholders and change loginFieldSet instructions */
    markLoginFieldSet: function() {
        var me = this;
        this.loginFieldSet.getInnerItems().forEach(function(field){
            field.setValue("");
            me.loginFieldSet.setInstructions(Messages.LOGIN_FAILED);
            field.element.select(".x-form-field").addCls('formInvalid');
        });
    }
});
