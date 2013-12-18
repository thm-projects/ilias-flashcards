/*--------------------------------------------------------------------------------+
  - Dateiname:      app/controller/Navigation.js
  - Beschreibung:   Navigation-Controller
  - Datum:          28.11.2013
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
Ext.define('LernApp.controller.Navigation', {
    extend: 'Ext.app.Controller',
    
    requires: ['Ext.Anim'],
    
    config: {
        refs: {
            
        },
        control: {
            
        }
    },
    
    /**
     * changes the current navigation view to a new one
     * 
     * @param: newNavigation - new navigation view 
     * @param: navigateBack  - true if navigating back
     */
    changeNavigation: function(newNavigation, navigateBack) {        
        var oldNavigation = LernApp.app.main.navigation;
        var animationDirection = navigateBack ? 'right' : 'left';
        
        /**
         * hide old navigation tab from tabpanel
         */
        LernApp.app.main.tabPanel.hideTab(oldNavigation);
        
        /**
         * overwrite old navigation,
         * launch afterNavigationChange method,
         * add new navigation to tabPanel (index 0 is reserved by tabBar)
         */
        LernApp.app.main.navigation = newNavigation;
        LernApp.app.main.navigation.afterNavigationChange();
        LernApp.app.main.tabPanel.insert(1, newNavigation);
        
        /**
         * switch to new navigation,
         * 
         * on animation end: 
         *  remove old navigation tab from tabpanel
         */
        LernApp.app.main.tabPanel.animateActiveItem(newNavigation, {
            type: 'slide',
            duration: 600,
            direction: animationDirection,
            listeners: {
                animationend: function() {
                    LernApp.app.main.tabPanel.remove(oldNavigation)
                    Ext.Viewport.setMasked(false);
                }
            }
        });
    }
});
