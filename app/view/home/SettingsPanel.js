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

Ext.define('LernApp.view.home.SettingsPanel', {
    extend: 'Ext.Panel',
    xtype: 'settingsPanel',

    requires: [
        'Ext.Button',
        'Ext.Panel',
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'LernApp.prototype.SliderField'
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
        
        this.controller = LernApp.app.storageController;
        
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

        this.notificationToggle = Ext.create('Ext.field.Toggle', {
            xtype: 'togglefield',
            name: 'notificationToggle',
            label: Messages.NOTIFICATIONS,
            id: 'notification',
            labelWidth: '60%',
            listeners: {
                scope: this,
                change: function (slider, newValue, oldValue) {
                    this.iterateThroughSliders(function(slider) {
                        if(newValue) slider.enable();
                        else slider.disable();
                    });
                    
                    this.controller.storeSetting(this.notificationToggle.getId(), newValue);
                }
            }
        });
        
        this.firstSlider = Ext.create('LernApp.prototype.SliderField', {
            label: Messages.FIRST_BOX,
            labelWidth: '30%',
            id: 'firstBox',
            value: 1,
            minValue: 1,
            maxValue: 15,
            increment: 1,
            disabled: true,
            listeners: {
                scope: this,
                change: function (me, slider, newValue, oldValue) {
                    this.controller.storeSetting(this.firstSlider.getId(), newValue);
                }
            }
        });
        
        this.secondSlider = Ext.create('LernApp.prototype.SliderField', {
            label: Messages.SECOND_BOX,
            labelWidth: '30%',
            id: 'secondBox',
            value: 3,
            minValue: 3,
            maxValue: 15,
            increment: 1,
            disabled: true,
            listeners: {
                scope: this,
                change: function (me, slider, newValue, oldValue) {
                    this.controller.storeSetting(this.secondSlider.getId(), newValue);
                }
            }
        });
        
        this.thirdSlider = Ext.create('LernApp.prototype.SliderField', {
            label: Messages.THIRD_BOX,
            labelWidth: '30%',
            id: 'thirdBox',
            value: 5,
            minValue: 5,
            maxValue: 15,
            increment: 1,
            disabled: true,
            listeners: {
                scope: this,
                change: function (me, slider, newValue, oldValue) {
                    this.controller.storeSetting(this.thirdSlider.getId(), newValue);
                }
            }
        });
        
        this.notificationFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.NOTIFICATIONS,
            cls: 'standardForm',
            width: '300px',

            items: [
                this.notificationToggle
            ]
        });
        
        this.settingsFieldSet = Ext.create('Ext.form.FieldSet', {
            title: Messages.LEARN_INTERVAL + ' (in Tagen)',
            cls: 'standardForm settingsPanel',
            width: '300px',

            items: [
                this.firstSlider,
                this.secondSlider,
                this.thirdSlider
            ]
        });

        this.add([
            this.titleBar,
            this.notificationFieldSet,
            this.settingsFieldSet
        ]);
        
        this.onAfter('initialize', this.onInitialize);
    },
    
    /**
     * actions to perform on initialization
     */
    onInitialize: function() {
        var me = this,
            toggle = this.notificationToggle;
        
        /** restore value from notificationToggle */
        me.controller.getStoredSetting(toggle.getId(), function(value) {
            if(value !== null) toggle.setValue(value);
        });
        
        /** restore values from sliders */
        me.iterateThroughSliders(function(slider) {
            me.controller.getStoredSetting(slider.getId(), function(value) {
                if(value !== null) slider.setValues(value);
            });
        });
    },
    
    /** dynamic function to iterate through all setting sliders */
    iterateThroughSliders: function(promise) {
        var me = this;
        var field = this.settingsFieldSet.getFieldsAsArray();
        
        field.forEach(function(element, index, array) {
            if(element.getId() !== me.notificationToggle.getId()) {
                promise(element);
            }
        });
    }
});
