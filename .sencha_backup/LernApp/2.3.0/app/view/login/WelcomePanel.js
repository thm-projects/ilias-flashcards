/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/login/WelcomePanel.js
  - Beschreibung:	Begrüßungsseite der Applikation. 
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

Ext.define('LernApp.view.login.WelcomePanel', {
    extend: 'Ext.Panel',
    xtype: 'welcomePanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'Ext.Img'
    ],
    
    config: {
        title: Messages.WELCOME,
        scrollable: true,
        
        layout: {
            type: 'vbox',
            align: 'center'
        }
    },

    initialize: function() {
        this.callParent(arguments);
        
        this.logo = Ext.create('Ext.Img', {
            mode: 'image',
            width: '310px',
            style: 'margin-top: 30px',
            src: 'resources/icons/logo.png'
        });
        
        this.continueButton = Ext.create('Ext.Button', {
           text: Messages.CONTINUE,
           ui: 'action',
           style: 'margin-top: 30px',
           handler: function() {
               LernApp.app.main.navigation.push(
                       LernApp.app.main.navigation.loginPanel
               );
           }
        });
        
        this.add([
            {
                xtype: 'label',
                style: 'margin-top: 30px',
                html: '<center>Dies ist eine Vorschau auf die App</center>'
            },
            this.logo, 
            this.continueButton
        ]);
    }
});
