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
        'Ext.Picker',
        'Ext.data.Store',
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemHighlight'
    ],
    
    config: {
        title: Messages.USER,
        scrollable: null,
        iconCls: 'user',
        id: 'userPanel',
        
        layout : {
            type : 'fit'
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
        
        this.picker = Ext.create('Ext.Picker', {
            hidden: true,
            doneButton: Messages.CHOOSE,
            cancelButton: Messages.CANCEL,
            slots: [
                {
                    name : 'categoryPicker',
                    title: Messages.CATEGORYS,
                    data : [
                        {text: Messages.ALL_CATEGORYS, value: Messages.ALL_CATEGORYS},
                        {text: Messages.PUBLIC_LAW, value: Messages.PUBLIC_LAW},
                        {text: Messages.CRIMINAL_LAW, value: Messages.CRIMINAL_LAW},
                        {text: Messages.CIVIL_LAW, value: Messages.CIVIL_LAW}
                    ]
                }
            ],
            listeners: {
                scope: this,
                change: function (picker, newValue) {
                    this.titleBar.setTitle(newValue.categoryPicker);
                    
                    /** update chart data to selected category */
                    switch(newValue.categoryPicker) {
                        case Messages.ALL_CATEGORYS:
                            this.updateChartData(this.allCategoryStore);
                            break;
                        case Messages.PUBLIC_LAW:
                            this.updateChartData(this.publicLawStore);
                            break;
                        case Messages.CRIMINAL_LAW:
                            this.updateChartData(this.criminalLawStore);
                            break;
                        case Messages.CIVIL_LAW:
                            this.updateChartData(this.civilianLawStore);
                            break;
                    }
                }
            }
        });
        
        this.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: Messages.USER,
            items: [
                this.backButton
            ]
        });
        
        this.pickerButton = Ext.create('Ext.Button', {
            text: Messages.CHANGE_CATEGORY,
            ui: 'action',
            align: 'center',
            handler: function(button) {
                var userPanel = LernApp.app.main.tabPanel.down('#userPanel');
                Ext.Viewport.add(userPanel.picker);
                userPanel.picker.show();
            }
        });
        
        this.buttonToolbar = Ext.create('Ext.Toolbar', {
            docked: 'top',
            cls: 'buttonToolbar',
            items: [
                { xtype: 'spacer' },
                this.pickerButton,
                { xtype: 'spacer' }
            ]
        });
        
        Ext.define('ChartDataModel', {
            extend: 'Ext.data.Model',
            
            config: {
                fields: [
                    { name: 'name', type: 'string' },
                    { name: 'data', type: 'int' }
                ]
            }
        });
        
        this.statisticChart = Ext.create('Ext.chart.PolarChart', {
            animate: true,
            innerPadding: 10,
            interactions: ['rotate', 'itemhighlight'],
            colors: ['#00FF00', '#FFFF00', '#FF9900', '#FF0000', '#999999'],

            store: Ext.create('Ext.data.Store', {
                model: 'ChartDataModel' ,
                data: [
                       {'name': 'Erlernt',  'data': 0},
                       {'name': 'Leicht',   'data': 0},
                       {'name': 'Geht so',  'data': 0},
                       {'name': 'Schwer',   'data': 0},
                       {'name': 'Rest',     'data': 0}
                ]
            }),
            
            legend: {
                position: 'bottom'
            },
            
            series: [{
                highlightCfg: {
                    margin: 10
                },
                
                type: 'pie',
                labelField: 'name',
                donut: 20,
                xField: 'data',
                
                /** render labels in pie chart */
                renderer: function(sprite, config, rendererData, index) {
                    var changes         = {},
                        currentStore    = rendererData.store,
                        currentRecord   = currentStore.getData().items[index],
                        currentValue    = currentRecord[rendererData.field].data;

                    if (config.type == "label") { 
                        changes.fontSize = 22;
                        changes.lineWidth = 1;
                        changes.contrast = true;
                        changes.display = 'rotate',
                        changes.text = currentValue;
                    }
                    return changes;
                }
            }]
        });
        
        this.add([
            this.titleBar,
            this.buttonToolbar,
            this.statisticChart
        ]);
        
        /** actions to perform when specified event is fired */
        this.on('initialize', this.loadAllStores);
        
        this.on('activate', function() {
            this.titleBar.setTitle(Messages.ALL_CATEGORYS);
            this.updateChartData(this.allCategoryStore);
        });
    },
    
    /**
     * updates data of chart store and refreshes statisticChart
     * 
     * param: store - data to write to chart store
     */
    updateChartData: function(store) {
        var statisticStore = this.statisticChart.getStore();
        
        /** write data from store to chart store */
        statisticStore.each(function(record, index) {
            store.each(function(catRecord, catIndex) {
                if(record.getData().name === catRecord.getData().name) {
                    record.set('data', catRecord.getData().data);
                }
            });
        });
 
        /** redraw chart */
        this.statisticChart.redraw();
    },
    
    /** 
     * reloads all stores and call summerizeCategoryData for each store
     */
    loadAllStores: function() {
        var me = this,
            statisticArray = [];
        
        LernApp.app.storageController.getFlashcardObject(function(flashcardObject) {
            for(box in flashcardObject) {
                var statisticObject = {};
                
                switch(box) {
                    case 'box1': statisticObject.name = 'Rest';         break;
                    case 'box2': statisticObject.name = 'Schwer';       break;
                    case 'box3': statisticObject.name = 'Geht so';      break;
                    case 'box4': statisticObject.name = 'Leicht';       break;
                    case 'box5': statisticObject.name = 'Erlernt';      break;
                }
                
                statisticObject.data = Object.keys(flashcardObject[box]).length;
                statisticArray.push(statisticObject);
            }
            
            me.allCategoryStore = Ext.create("Ext.data.Store", {
                model: 'ChartDataModel',
                data : statisticArray
            });
        });
    },
    
    /**
     * function callback to summerize data from stores
     */
    summerizeCategoryData: function(records, me) {
        var store    = me.allCategoryStore;
        var data     = store.getData();

        data.each(function(element, index, array) {
            records.forEach(function(recElement, recIndex, recArray) {
                if(element.getData().name === recElement.data.name) {
                    store.add({
                        name: element.getData().name, 
                        data: element.getData().data + recElement.data.data
                    });
                    store.remove(element);
                }
            });
        });
    }
});
