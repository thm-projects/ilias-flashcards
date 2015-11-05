/*--------------------------------------------------------------------------------+
  - Dateiname:		app/proxy/Proxy.js
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

Ext.define('LearningApp.proxy.Proxy', {
    extend: 'Ext.data.Connection',
    xtype: 'proxy',

    config: {
        url: "http://ilias-staging.mni.thm.de:8080/connector/ilias/",
        //url: "http://localhost:8080/connector-service/ilias/",
        //url: "https://quizapp.uni-giessen.de/connector/ilias/",
        useDefaultXhrHeader: false,
        withCredentials: true,
        disableCaching: false,
        method: 'GET'
    },
    
    /**
     * removes custom headers from requests
     */
    resetDefaultRequestHeaders: function() {
        this.setDefaultHeaders(null);
    },
    
    /** 
     * checks online status of service 
     */
    check: function(callback) {
        this.request({
            url: this.getUrl() + "check",
            
            success: function(response) {
                if(response.responseText = 'OK') {
                    callback.success.call(this, arguments);
                }
            },
            
            failure: function(response) {
                callback.failure.apply(this, arguments);
            },
            
            callback: function(response) {
                callback.callback.apply(this, arguments);
            },
            
            scope: this
        })
    },
    
    /** 
     * check login state 
     */
    checkLogin: function(callback) {
        var me = this;
       
        LearningApp.app.storageController.getLoggedInUserObj(function(loginObj) {
            if(loginObj != null) me.setDefaultHeaders(loginObj.authObj);
        });
    },
    
    /** 
     * perform login through basic authentication 
     * @param uname: username
     * @param upass: password
     */
    login: function(uname, upass, callback) {
        this.request({
           url: this.getUrl() + "login",
           method : 'POST',
           
           params: {
               uname: uname,
               upass: upass
           },
           
           success: function(response) {
               callback.success.call(this, Ext.decode(response.responseText));
           },
           
           failure: function(response) {
               callback.failure.apply(this, arguments);
           },
           
           scope: this
        });
    },
    
    /**
     * Gets the card index tree
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getCardIndexTree: function(callback) {
        this.request({
            url: this.getUrl() + "1",
            
            success: function(response) {
                if (response.status === 204) {
                    callback.success.call(this, []);
                } else {
                    callback.success.call(this, Ext.decode(response.responseText));
                }
            },
            
            failure: function(response) {
                Ext.Viewport.setMasked(false);
                if (response.status === 401) {
                    Ext.Msg.alert('Login', 'Ihre Logindaten sind abgelaufen. Bitte erneut einloggen.', function() {
                        LearningApp.app.getController('LoginController').logout();
                    });
                } else {
                    Ext.Msg.alert('Offline-Modus', 'Das Programm wird im Offline-Modus ausgeführt.');
                    callback.failure.apply(this, arguments);
                }
            },
            
            scope: this
        });
    },
    
    /**
     * Gets random choosen questions from a test
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getRandomQuestions: function(refId, callbacks) {
        this.request({
            url: this.getUrl() + "question/" + refId,       
            
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
            
            scope: this
        });
    },
    
    /**
     * Gets all questions from a test
     * @param object with success-callback
     * @return cardindex-objects, if found
     * @return false, if nothing found
     */
    getAllQuestions: function(refId, callbacks) {
        this.request({
            url: this.getUrl() + "question/" + refId + "?source=ALL",
            
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
            
            scope: this
        });
    }
});
