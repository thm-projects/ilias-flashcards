/*--------------------------------------------------------------------------------+
  - Dateiname:      app/controller/StorageController.js
  - Beschreibung:   StorageController
  - Datum:          22.04.2014
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
Ext.define('LernApp.controller.StorageController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            
        },
        control: {
            
        }
    },
    
    initializeStorage: function() {
        var me = this;
        
        /** use localstorage as driver for debugging reasons */
        localforage.setDriver('localStorageWrapper');
        
        localforage.config({
            name        : 'LernAppDB',
            version     : 1.0,
            storeName   : 'appDatabase',
            description : 'Application Database'
        });
        
        /** initialize question object **/
        this.getStoredQuestionObject(function(storedQuestions) {
            if(storedQuestions == null) {
                me.setStoredQuestionObject(new Object());
            }
        });
        
        /** initialize categories object **/
        this.getStoredCategories(function(categories) {
            console.log(categories);
            if(categories == null) {
                me.setStoredCategories(new Object());
            }
        });
    },
    
    getStoredQuestionObject: function(promise) {
        localforage.getItem('storedQuestions').then(promise);
    },
    
    setStoredQuestionObject: function(value, promise) {
        localforage.setItem('storedQuestions', value).then(promise);
    },
    
    getStoredCardIndexTreeObject: function(promise) {
        localforage.getItem('cardIndexTree').then(promise);
    },
    
    setStoredCardIndexTreeObject: function(value, promise) {
        localforage.setItem('cardIndexTree', value).then(promise);
    },
    
    getStoredCategories: function(promise) {
        localforage.getItem('selectedCategories').then(promise);
    },
    
    setStoredCategories: function(value, promise) {
        localforage.setItem('selectedCategories', value).then(promise);
    },
    
    addStoredCategories: function(categories, promise) {
        var me = this;
        this.getStoredCategories(function(storedCategories) {
            for(var category in categories) {
                storedCategories[category] = categories[category];
            }
            me.setStoredCategories(storedCategories, promise);
        });
    },
        
    storeCardIndexTree: function(promise) {
        var me = this;
        LernApp.app.proxy.getCardIndexTree({
            success: function(tree) {
                me.setStoredCardIndexTreeObject(tree, promise);
            }
        });
    },
    
    storeQuestions: function(refId, promise) {
        var me = this;
        LernApp.app.proxy.getQuestions(refId, {
            success: function(questions) {
                questionObj[refId] = questions;
                me.setStoredQuestionObject(questionObj, promise);
            }
        });
    },
    
    storeMultipleQuestions: function(categories, promise) {
        var me = this,
            categoryCount = 0,
            completedRequests = 0;
            
        for(var category in categories) {
            if(categories[category]) categoryCount++;
        }
        
        var onAjaxComplete = function(questionObj) {
            if(completedRequests >= categoryCount) {
                me.setStoredQuestionObject(questionObj, promise);
            }
        };

        this.getStoredQuestionObject(function(questionObj) {
           for(var category in categories) {
               if(categories[category]) {
                   LernApp.app.proxy.getQuestions(category, {
                       success: function(questions) {
                           completedRequests++;
                           questionObj[questions.refId] = questions.data;
                           onAjaxComplete(questionObj);
                       }
                   });
               }
           }
           
           if(categoryCount == 0) promise();
        });
    },
    
    getStoredQuestions: function(refId, promise) {
        this.getStoredQuestionObject(function(questionObj) {
            console.log(questionObj);
            if(typeof questionObj[refId] == 'undefined') {
                promise(null);
            } else {
                promise(questionObj[refId]);
            }
        });
    },
    
    removeQuestionsFromStorage: function(refId, promise) {
        var me = this;
        this.getStoredQuestionObj(function(storedQuestions) {
            delete storedQuestions[refId];
            me.setStoredQuestionObject(storedQuestions, promise);
        });
    },
    
    removeMultipleQuestionsFromStorage: function(categories, promise) {
        var me = this;
                
        this.getStoredQuestionObject(function(questionObj) {
            for(var category in categories) delete questionObj[category];
            me.setStoredQuestionObject(questionObj, promise);
        });
    },
    
    removeStoredCategories: function(deletedCategories, promise) {
        var me = this;
        this.getStoredCategories(function(categories) {
            for(var cat in categories) {
                for(var deletedCat in deletedCategories) {
                    if(deletedCat == cat) {
                        delete categories[cat];
                    }
                }
            }
            
            me.removeMultipleQuestionsFromStorage(deletedCategories, function() {
                me.setStoredCategories(categories, promise);
            });
        });
    },
    
    getQuestions: function(refId, promise) {
        var me = this;
        
        LernApp.app.proxy.getQuestions(refId, {
            success: function(questionList) {
                promise(questionList);
            },
            failure: function() {
                me.getStoredQuestions(refId, promise)
                /** todo: state failure message or indicator */
            },
            notFound: function() {
                me.getStoredQuestions(refId, promise)
                /** todo: state failure message or indicator */
            },
            unauthorized: function() {
                me.getStoredQuestions(refId, promise)
                /** todo: state failure message or indicator */
            },
            forbidden: function() {
                me.getStoredQuestions(refId, promise)
                /** todo: state failure message or indicator */
            }
        });
    }
});