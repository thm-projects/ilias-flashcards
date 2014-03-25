/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/OverviewPanel.js
  - Beschreibung:	Übersichtsseite der Applikation. 
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

Ext.define('LernApp.view.home.OverviewPanel', {
    extend: 'Ext.Panel',
    xtype: 'overviewPanel',

    requires: [
        'Ext.Label',
        'Ext.Spacer',
        'Ext.Button',
        'LernApp.view.learncard.CardCarousel',
        'LernApp.view.cardindex.CardIndex'
    ],
    
    config: {
        title: Messages.OVERVIEW,
        scrollable: true,
        
        layout : {
            type : 'vbox',
            align: 'center'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;
        
        this.continueButton = Ext.create('Ext.Button', {
            text: Messages.CONTINUE,
            scrollable: true,
            ui: 'confirm',
            handler: function() {

            }
         });
        
        var comingSoon = function(component) {
            var comingSoonPanel = Ext.create('Ext.Panel', {
                top: -1000,
                html: "<div style='padding: 0.5em'>"+Messages.FEATURE_COMING_SOON+"</div>"
            });
            comingSoonPanel.showBy(component, 'tc-bc');
            Ext.defer(function() {
                comingSoonPanel.destroy();
            }, 2000);
        };

        this.learnCardFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.LEARN_CARD,
            cls: 'standardForm',
            width: '300px',
            style: 'margin-top: 0px',
            
            items: [
                {
                    xtype   : 'button',
                    name    : 'learnCards',
                    text    : Messages.LEARN_LEARN_CARDS,
                    cls     : 'forwardListButton',
                    disabled: true,
                    handler : comingSoon
                }, {
                    xtype   : 'button',
                    name    : 'showCards',
                    text    : Messages.SHOW_LEARN_CARDS,
                    cls     : 'forwardListButton',
                    handler : function() {
                        LernApp.app.main.navigation.push(
                                Ext.create('LernApp.view.learncard.CardCarousel')
                        );
                    }
                }, {
                    xtype   : 'button',
                    name    : 'randomCards',
                    text    : Messages.SHOW_RANDOM_CARDS,
                    cls     : 'forwardListButton',
                    handler : function() {
                        LernApp.app.main.navigation.push(
                                Ext.create('LernApp.view.learncard.CardCarousel')
                        );
                    }
                }
            ]
        });
        
        this.cardIndexFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.CARD_INDEX,
            cls: 'standardForm',
            width: '300px',
            style: 'margin-top: 0px',
            
            items: [
                {
                    xtype   : 'button',
                    name    : 'showCardIndex',
                    text    : Messages.SHOW_CARD_INDEX,
                    cls     : 'forwardListButton',
                    handler : function() {
                        LernApp.app.main.navigation.push(
                                Ext.create('LernApp.view.cardindex.CardIndex')
                        );
                    }
                }, {
                    xtype   : 'button',
                    name    : 'showCardIndex',
                    text    : Messages.EDIT_CARD_INDEX,
                    cls     : 'forwardListButton',
                    handler : function() {
                        LernApp.app.main.navigation.push(
                                Ext.create('LernApp.view.cardindex.CardIndex', {
                                    edit: true
                                })
                        );
                    }
                }
            ]
        });
        
        this.add([
            this.learnCardFieldSet,
            this.cardIndexFieldSet
        ]);
        
        /**
         * show logout button when panel is activated
         */
        this.onAfter('activate', function() {
            LernApp.app.main.navigation.logoutButton.show();
        });
        
        /**
         * hide logout button when panel is deactivated
         */
        this.on('deactivate', function() {
            LernApp.app.main.navigation.logoutButton.hide();
        });
    }
});
