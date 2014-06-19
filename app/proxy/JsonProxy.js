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
        url: "http://ilias-staging.mni.thm.de:8080/connector-service/ilias/",
    },
    
    /**
     * Gets the card index tree
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getCardIndexTree: function(callback) {
        Ext.Ajax.request({
            url : this.config.url + "1",
            method : 'GET',
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
                Ext.Viewport.setMasked(false);
                console.log(response.status);
                if (response.status === 401) {
                    console.log('unauthicated');
                } else {
                    Ext.Msg.alert('Offline-Modus', 'Das Programm wird im Offline-Modus ausgeführt.')
                    callback.failure.apply(this, arguments);
                }
            },
            scope : this
        });
    },
    
    /**
     * Gets random choosen questions from a test
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getRandomQuestions: function(refId, callbacks) {
        Ext.Ajax.request({
            url : this.config.url + "question/" + refId,
            method : 'GET',
            username : 'test',
            password : 'test',
            withCredentials: true,
            useDefaultXhrHeader: false,
            
            success: function(response) {
                if (response.status === 204) {
                    callbacks.success.call(this, {});
                } else {
                    callbacks.success.call(this, {
                        refId: refId,
                        data: Ext.decode(response.responseText)
                    });
                }
            },
            
            failure: function(response) {
                if (response.status === 401) {
                    callbacks.unauthorized.apply(this, arguments);
                } else if (response.status === 404) {
                    callbacks.notFound.apply(this, arguments);
                } else if (response.status = 403) {
                    callbacks.forbidden.apply(this, arguments);
                } else {
                    callbacks.failure.apply(this, arguments);
                }
            },
            scope : this
        });
    },
    
    /**
     * Gets all questions from a test
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getAllQuestions: function(refId, callbacks) {
        Ext.Ajax.request({
            url : this.config.url + "question/" + refId + "?source=ALL",
            method : 'GET',
            username : 'test',
            password : 'test',
            withCredentials: true,
            useDefaultXhrHeader: false,
            
            success: function(response) {
                if (response.status === 204) {
                    callbacks.success.call(this, {});
                } else {
                    callbacks.success.call(this, {
                        refId: refId,
                        data: Ext.decode(response.responseText)
                    });
                }
            },
            
            failure: function(response) {
                if (response.status === 401) {
                    callbacks.unauthorized.apply(this, arguments);
                } else if (response.status === 404) {
                    callbacks.notFound.apply(this, arguments);
                } else if (response.status = 403) {
                    callbacks.forbidden.apply(this, arguments);
                } else {
                    callbacks.failure.apply(this, arguments);
                }
            },
            scope : this
        });
    }
});
