/*--------------------------------------------------------------------------------+
  - Dateiname:		app/proxy/JsonProxy.js
  - Beschreibung:	JsonP Proxy
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

Ext.define('LernApp.proxy.JsonProxy', {
    extend: 'Ext.data.proxy.JsonP',
    xtype: 'jsonProxy',

    config: {
        //url: "https://arsnova.eu/statistics"
        //url: "https://ilias-staging.mni.thm.de/connector-service/ilias/1",
        url: "http://localhost:8080/connector-service/ilias/1"
    },
    
    /**
     * Get the sessions where user is visitor
     * @param login from user
     * @param object with success-, unauthenticated- and failure-callbacks
     * @return session-objects, if found
     * @return false, if nothing found
     */
    getCardIndexTree: function(callback) {
        Ext.Ajax.request({
            url : this.config.url,
            method : 'GET',
            username : 'test',
            password : 'test',
            withCredentials: true,
            useDefaultXhrHeader: false,
            
            success: function(response) {
                if (response.status === 204) {
                    callback.success.call(this, []);
                } else {
                    callback.success.call(this, Ext.decode(response.responseText));
                }
            },
            
            failure: function(response) {
                if (response.status === 401) {
                    console.log('unauthicated');
                } else {
                    Ext.Msg.alert('Verbindungsprobleme', 'Keine Verbindung möglich.')
                    console.log('server-side error');
                }
            },
            scope : this
        });
    }
});
