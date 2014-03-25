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

Ext.define('LernApp.view.login.LoginPanel', {
    extend: 'Ext.Panel',
    xtype: 'loginPanel',

    requires: [        
        'Ext.field.Text',
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'LernApp.view.home.HomeNavigation'
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
        
        this.loginFieldSet = Ext.create('Ext.form.FieldSet', {
            instructions: Messages.ENTER_YOUR_DATA,
            width: '300px',
            style: 'margin-bottom: 15px',
            
            items: [
                {
                    xtype   : 'textfield',
                    name    : 'userName',
                    cls     : 'loginFields',
                    placeHolder: Messages.USERNAME
                }, {
                    xtype   : 'passwordfield',
                    name    : 'password',
                    cls     : 'loginFields',
                    placeHolder: Messages.PASSWORD
                }
            ]
        });
        
        this.confirmButton = Ext.create('Ext.Button', {
            text    : 'Anmelden',
            ui      : 'confirm',
            handler : function() {
                Ext.Viewport.setMasked({ xtype:'loadmask', message: Messages.LOADING });      
                
                /** destroy loadingmask and restore saved animation */
                var task = Ext.create('Ext.util.DelayedTask', function () {
                    LernApp.app.getController('Navigation').changeNavigation(
                            Ext.create('LernApp.view.home.HomeNavigation')
                    );
                });
                
                task.delay(100);
            }
        });
        
        this.logo = Ext.create('Ext.Img', {
            mode: 'image',
            height: '100px',
            style: {
                'margin-top': '20px',
                'margin-bottom': '10px'
            },
            src: 'resources/icons/logo_notext.png'
        });
        
        this.add([ 
            this.logo,
            this.loginFieldSet, 
            this.confirmButton
        ]);
    }
});
