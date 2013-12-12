/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/SettingsPanel.js
  - Beschreibung:	Einstellungsseite der Applikation. 
  - Datum:			30.11.2013
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

Ext.define('LernApp.view.home.SettingsPanel', {
    extend: 'Ext.Panel',
    xtype: 'settingsPanel',

    requires: [
        'Ext.Button',
        'Ext.Panel',
        'Ext.TitleBar',
        'Ext.form.FieldSet'
    ],
    
    config: {
        title: Messages.SETTINGS,
        fullscreen: true,
        scrollable: true,
        iconCls: 'settings',
        id: 'settingsPanel',
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        this.backButton = Ext.create('Ext.Button', {
            text: Messages.HOME,
            align: 'left', 
            ui: 'back',
            handler : function(button) {
                LernApp.app.main.tabPanel.animateActiveItem(0, {
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
        
        var comingSoon = function(component) {
            var comingSoonPanel = Ext.create('Ext.Panel', {
                top   : -1000,
                html: "<div style='padding: 0.5em'>"+Messages.FEATURE_COMING_SOON+"</div>"
            });
            comingSoonPanel.showBy(component, 'tc-bc');
            Ext.defer(function() {
                comingSoonPanel.destroy();
            }, 2000);
        };

        this.firstButtonPanel = Ext.create('Ext.form.FieldSet', {
            title: Messages.LEARN_CARD,
            cls: 'standardForm',
            width: '310px',
            
            items: [
                {
                    xtype   : 'button',
                    name    : 'learnCards',
                    text    : 'Benachrichtigungen',
                    cls     : 'forwardListButton',
                    handler : comingSoon
                }, {
                    xtype   : 'button',
                    name    : 'showCards',
                    text    : 'Lernintervalle',
                    cls     : 'forwardListButton',
                    handler : comingSoon
                }
            ]
        });

        this.add([
            this.titleBar,
            this.firstButtonPanel
        ]);
    }
});
