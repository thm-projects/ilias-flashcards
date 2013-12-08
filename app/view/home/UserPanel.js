/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/home/UserPanel.js
  - Beschreibung:	Benutzerverwaltung der Applikation. 
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

Ext.define('LernApp.view.home.UserPanel', {
    extend: 'Ext.Panel',
    xtype: 'userPanel',

    requires: [
        'Ext.data.Store',
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate'
    ],
    
    config: {
        title: Messages.USER,
        scrollable: true,
        iconCls: 'user',
        id: 'userPanel',
        
        layout : {
            type : 'fit'
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        this.backButton = Ext.create('Ext.Button', {
            text: Messages.BACK,
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
            title: Messages.USER,
            items: [this.backButton]
        });
        
        this.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'data'],
            data: [
                { 'name':'Erlernt', 'data':20 },
                { 'name':'Leicht', 'data':10 },
                { 'name':'Geht so', 'data':8 },
                { 'name':'Schwer', 'data':6 }
            ]
        });
        
        this.statisticChart = Ext.create('Ext.chart.PolarChart', {
            animate: true,
            interactions: ['rotate'],
            colors: ['#00FF00', '#FFFF00', '#FF9900', '#FF0000'],
            store: this.store,
            legend: {
                position: 'bottom'
            },
            series: [{
                type: 'pie',
                field: 'data',
                showInLegend: true,
                donut: 20,
                label: {
                    field: 'name',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial'
                }
            }]
        });
        
        this.add([
            this.titleBar,
            this.statisticChart
        ]);
    }
});
