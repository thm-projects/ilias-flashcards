/*--------------------------------------------------------------------------------+
  - Dateiname:      app/prototype/CustomMask.js
  - Beschreibung:   Angepasste Maske, um Scrolling innerhalb eines Carousel zu ermoeglichen.
  - Datum:          09.11.2013
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
Ext.define('LearningApp.prototype.CustomMask', {
    extend: 'Ext.Component',
    xtype: 'customMask',

    config: {
        baseCls: Ext.baseCSSPrefix + 'mask',
        transparent: false,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    initialize: function() {
        this.callSuper();
        this.element.on('*', 'onEvent', this);
    },

    updateTransparent: function(newTransparent) {
        this[newTransparent ? 'addCls' : 'removeCls'](this.getBaseCls() + '-transparent');
    }
});