/*--------------------------------------------------------------------------------+
  - Dateiname:      app/prototype/SliderField.js
  - Beschreibung:   SliderField prototype. 
  - Autor(en):      Andreas Gärtner <andreas.gaertner@hotmail.com>
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
Ext.define('LernApp.prototype.SliderField', {
    extend  : 'Ext.field.Field',
    xtype   : 'sliderField',
    requires: [
        'Ext.slider.Slider'
    ],

    config: {
        cls: 'sliderField',
        tabIndex: -1
    },

    proxyConfig: {
        value: 0,
        minValue: 0,
        maxValue: 100,
        increment: 1
    },

    constructor: function(config) {
        config = config || {};

        if (config.hasOwnProperty('values')) {
            config.value = config.values;
        }

        this.callParent([config]);
    },
  
    initialize: function() {
        this.callParent();
    
        this.getComponent().on({
            scope       : this,
            change      : 'onSliderChange',
            dragstart   : 'onSliderDragStart',
            drag        : 'onSliderDrag',
            dragend     : 'onSliderDragEnd'
        });
    },

    getElementConfig: function() {
        var self = this;
        var originalConfig = self.callParent();

        originalConfig.children[1].children = [{
            reference: 'inputField',
            tag: 'div',
            cls: 'sliderInputField',
            children: [
                {
                    reference: 'inputValue',
                    tag: 'input',
                    cls: 'sliderInputValue'
                }
            ]
        }];

        return originalConfig;
    },
  
    // @private
    applyComponent: function(config) {
        this.setInputValue(this.config.value);
        return Ext.factory(config, Ext.slider.Slider);
    },

    onSliderChange: function(me, thumb, newValue, oldValue) {
        this.setInputValue(newValue);
        this.fireEvent('change', this, thumb, newValue, oldValue);
    },

    onSliderDragStart: function(me, thumb, newValue, oldValue) {
        this.fireEvent('dragstart', this, thumb, newValue, oldValue);
    },

    onSliderDrag: function(me, thumb, newValue, oldValue) {
        this.setInputValue(newValue);
        this.fireEvent('drag', this, thumb, newValue, oldValue);
    },

    onSliderDragEnd: function(me, thumb, newValue, oldValue) {
        this.fireEvent('dragend', this, thumb, newValue, oldValue);
    },
    
    setInputValue: function(value) {
        this.inputValue.dom.value = value;
    },

    setValues: function(value) {
        this.setValue(value);
        this.setInputValue(value);
        this.updateMultipleState();
    },

    getValues: function() {
        return this.getValue();
    },

    reset: function() {
        var config = this.config,
        initialValue = (this.config.hasOwnProperty('values')) ? config.values : config.value;

        this.setValue(initialValue);
    },

    doSetDisabled: function(disabled) {
        this.callParent(arguments);

        this.getComponent().setDisabled(disabled);
    },
  
    updateMultipleState: function() {
        var value = this.getValue();
        if (value && value.length > 1) {
            this.addCls(Ext.baseCSSPrefix + 'slider-multiple');
        }
    }
});
