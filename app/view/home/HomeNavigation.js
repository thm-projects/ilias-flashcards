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
        'LernApp.view.home.SettingsPanel',
        'LernApp.view.home.UserPanel',
        'Ext.util.DelayedTask',
        'Ext.SegmentedButton'
    ],
    
    config: {
        title: Messages.HOME,
        autoDestroy: true
    },
    
    instanciateComponents: function() {
        this.userPanel = Ext.create('LernApp.view.home.UserPanel');
        this.settingsPanel = Ext.create('LernApp.view.home.SettingsPanel');
        this.overviewPanel = Ext.create('LernApp.view.home.OverviewPanel');
    },
    
    initialize: function() {
        this.callParent(arguments);
        this.instanciateComponents();
        
        var me = this;

        this.logoutButton = Ext.create('Ext.Button', {
            text    : Messages.LOGOUT,
            cls     : 'confirmGreen',
            ui      : 'back',
            align   : 'left',
            hidden  : true,
            handler : function() {
                this.disable();
                LernApp.app.getController('LoginController').logout();
            }
        });
        
        this.viewButton = Ext.create('Ext.Button', {
            text    : Messages.VIEW,
            ui      : 'action',
            align   : 'right',
            hidden  : true,

            handler : function() {
                if(me.viewChangePanel.isHidden()) {                    
                    me.viewChangePanel.showBy(this);
                    me.viewChangePanel.show();
                    me.viewChangePanel.hideTask.delay(3000);
                } else {
                    me.viewChangePanel.hide();
                }
            }
        });
        
        this.viewChangePanel = Ext.create('Ext.Panel', {
            top: -1000,
            hidden: true,
            cls: 'viewChangePanel',
            hideTask : Ext.create('Ext.util.DelayedTask', function () {
                me.viewChangePanel.hide();
            }),

            items: [
                {
                    xtype: 'label',
                    cls: 'titleLabel',
                    html: Messages.VIEW_OPTIONS
                },
                {
                    xtype   : 'segmentedbutton',
                    itemId  : 'viewChangeButton',
                    align   : 'center',
                    allowDepress: false,
                    items: [{
                        width: '50%',
                        itemId: 'tree',
                        text: Messages.TREE,
                        handler: function () {
                            var main = LernApp.app.main;
                            var panel = main.navigation.getActiveItem();
                            me.viewChangePanel.hideTask.cancel();
                            me.viewChangePanel.hideTask.delay(3000);
                            panel.setDisplayMode('tree');
                        }
                    }, {
                        width: '50%',
                        itemId: 'test',
                        text: Messages.TEST,
                        handler: function () {
                            var main = LernApp.app.main;
                            var panel = main.navigation.getActiveItem();
                            me.viewChangePanel.hideTask.cancel();
                            me.viewChangePanel.hideTask.delay(3000);
                            panel.setDisplayMode('test');
                        }
                    }]
                }
            ]
        });
        
        /** add buttons to navigationBar */
        this.getNavigationBar().add(this.logoutButton);
        this.getNavigationBar().add(this.viewButton);
        
        /** initialize listeners */
        this.on('initialize', this.onInitialize);
        this.on('destroy', this.onDestroy);
    },
    
    
    /** actions to fulfill after navigation change (Navigation controller) */
    afterNavigationChange: function() {
        this.push(this.overviewPanel);
    },
    
    
    /** actions to fulfill on initialization */
    onInitialize: function() {
        var me = this;
        
        LernApp.app.main.tabPanel.addBeforeLastTab(
                this.userPanel
        );
        
        LernApp.app.main.tabPanel.addBeforeLastTab(
                this.settingsPanel
        );
        
        LernApp.app.storageController.getStoredSetting('preferedView', function(view) {
            var viewChangeButton = me.viewChangePanel.down('#viewChangeButton');
            var innerButtons = viewChangeButton.getInnerItems();
            
            if(typeof view !== 'undefined') {
                innerButtons.forEach(function(item, index) {
                    if(item.getItemId() == view) viewChangeButton.setPressedButtons([index]);
                });
            } 
        });
    },
    
    
    /** actions to fulfill on panel destroy */
    onDestroy: function() {
        this.userPanel.destroy();
        this.settingsPanel.destroy();
        this.overviewPanel.destroy();
    }
});
