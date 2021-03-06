/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/about/AboutPanel.js
  - Beschreibung:	Hilfeseite der Applikation. 
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

Ext.define('LearningApp.view.about.AboutPanel', {
    extend: 'Ext.Panel',
    xtype: 'aboutPanel',

    requires: [
    ],
    
    config: {
        title: Messages.INFO,
        scrollable: true,
        iconCls: 'info',
        
        layout : {
            type : 'vbox',
            pack : 'center',
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
                LearningApp.app.main.tabPanel.animateActiveItem(0, {
                    type: 'slide', 
                    direction: 'right'
                });
            }
        });
        
        this.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: Messages.INFORMATION,
            items: [this.backButton]
        });
        
        this.logo = Ext.create('Ext.Img', {
            mode: 'image',
            height: '190px',
            style: 'margin-top: 10px',
            src: 'resources/icons/icon_help.png'
        });
        
        this.buttonFieldSet = Ext.create('Ext.form.FieldSet', {
            cls: 'standardForm',
            width: '300px',
            
            items: [
                {
                    xtype: 'button',
                    text: 'Impressum',
                    disabled: true,
                    cls: 'forwardListButton'
                }, 
                {
                    xtype: 'button',
                    text: 'Datenschutz',
                    disabled: true,
                    cls: 'forwardListButton'
                }
            ]
        });
        
        this.add([
            this.titleBar,
            { xtype: 'spacer' },
            this.logo,
            { xtype: 'spacer' },
            this.buttonFieldSet,
            { xtype: 'spacer', width: 'auto', flex: 5}
        ]);
    }
});
