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
    
    /** initialize storage at startup */
    init: function() {
        this.initializeStorage();
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
        
        /** initialize category object **/
        this.getStoredCategories(function(categories) {
            if(categories == null) {
                me.setStoredCategories(new Object());
            }
        });
        
        /** initialize question object **/
        this.getStoredQuestionObject(function(storedQuestions) {
            if(storedQuestions == null) {
                me.setStoredQuestionObject(new Object());
            }
        });
        
        /** initialize test object **/
        this.getStoredTestObject(function(tests) {
            if(tests == null) {
                me.setStoredTestObject(new Object());
            }
        });
        
        /** initialize settings object **/
        this.getStoredSettingsObject(function(settings) {
            if(settings == null) {
                me.setStoredSettingsObject(new Object());
            }
        });
    },
    
    /** getter for storedQuestions */
    getStoredQuestionObject: function(promise) {
        localforage.getItem('storedQuestions').then(promise);
    },
    
    /** setter for storedQuestions */
    setStoredQuestionObject: function(object, promise) {
        localforage.setItem('storedQuestions', object).then(promise);
    },
    
    /** getter for storedTests */
    getStoredTestObject: function(promise) {
        localforage.getItem('storedTests').then(promise);
    },
    
    /** setter for storedTests */
    setStoredTestObject: function(object, promise) {
        localforage.setItem('storedTests', object).then(promise);
    },
    
    /** getter for cardIndexTree */
    getStoredCardIndexTreeObject: function(promise) {
        localforage.getItem('cardIndexTree').then(promise);
    },
    
    /** setter for cardIndexTree */
    setStoredCardIndexTreeObject: function(object, promise) {
        localforage.setItem('cardIndexTree', object).then(promise);
    },
    
    /** getter for selectedCategories */
    getStoredCategories: function(promise) {
        localforage.getItem('selectedCategories').then(promise);
    },
    
    /** setter for selectedCategories */
    setStoredCategories: function(object, promise) {
        localforage.setItem('selectedCategories', object).then(promise);
    },
    
    /** getter for settingsObject */
    getStoredSettingsObject: function(promise) {
        localforage.getItem('settingsObject').then(promise);
    },
    
    /** setter for settingsObject */
    setStoredSettingsObject: function(object, promise) {
        localforage.setItem('settingsObject', object).then(promise);
    },
    
    /** 
     * Adds references of selected categories to database.
     * @param {Object} categories Object with selected categories.
     * @param {Function} promise Function to call after processing.
     */
    addStoredCategories: function(categories, promise) {
        var me = this;
        
        this.getStoredCategories(function(storedCategories) {
            for(var category in categories) {
                storedCategories[category] = categories[category];
            }
            me.setStoredCategories(storedCategories, promise);
        });
    },
    
    /** 
     * Store card index tree from backend database to local database.
     * @param {Function} promise Function to call after processing.
     */
    storeCardIndexTree: function(promise) {
        var me = this;
            offline = true;
            
        LernApp.app.proxy.getCardIndexTree({
            success: function(tree) {
                me.setStoredCardIndexTreeObject(tree, function(tree) {
                    promise(tree, !offline)
                });
            },
            failure: function() {
                me.getStoredCardIndexTreeObject(function(tree) {
                    promise(tree, offline);
                });
            }
        });
    },
    
    /** 
     * Adds references of questions, selected by choosen categories,
     * to local database. If a tests has randomQuestions option active,
     * a random collection of questions is returned; otherwise all stored
     * questions of a test is returned.
     * @param {Object} categories Object with selected categories.
     * @param {Function} promise Function to call after processing.
     */
    storeQuestions: function(categories, promise) {
        var me = this,
            questionIds = {};

        if(Object.keys(categories).length == 0) {
            promise();
            return;
        }

        this.getStoredTestObject(function(testObj) {
            for(var category in testObj) {
                if(testObj[category]) {
                    var cat = testObj[category];
                    
                    var questionSet = Object.keys(cat.questions).map(function(key) {
                        return cat.questions[key].id;
                    });
                    
                    if(cat.isRandomTest) {
                        var randomIds = [];
                        questionIds[category] = new Array();
                        
                        while(Object.keys(randomIds).length < cat.randomQuestionCount) {
                            var value = Math.floor(Math.random() * cat.questionCount);
                            randomIds[(value != 0 ? value: null)] = true;
                        }
    
                        for(id in randomIds) {
                            questionIds[category].push(questionSet[(id == 'null' ? 0 : id)]);
                        }
                    }
                    questionIds[category] = questionSet;
                }
            } me.setStoredQuestionObject(questionIds, promise);
        });
    },
    
    /** 
     * Stores all available tests to local database.
     * @param {Object} tree Tree object of card index.
     * @param {Function} promise Function to call after processing.
     */
    storeTests: function(tree, promise) {
        var me = this,
            categories = {},
            categoryCount = 0,
            completedRequests = 0;
        
        var onAjaxComplete = function(testObj) {
            if(completedRequests >= categoryCount) {
                me.setStoredTestObject(testObj, promise);
            }
        };
            
        var iterateThrough = function(data) {
            if(data.hasOwnProperty('children')) {
                data.children.forEach(function(child) {
                    iterateThrough(child);
                });
            } else if(data.hasOwnProperty('leaf')) {
                categories[data.id] = data;
                categoryCount++;
            }
        };
        
        /* iterate through tree object */
        iterateThrough(tree);
        
        this.getStoredTestObject(function(testObj) {
           for(var category in categories) {               
               LernApp.app.proxy.getAllQuestions(category, {
                   success: function(test) {
                       var cat = categories[test.refId];
                       
                       testObj[test.refId] = {
                           questions: test.data,
                           isRandomTest: cat.isRandomTest,
                           questionCount: cat.questionCount,
                           randomQuestionCount: cat.randomQuestionCount
                       };
                       
                       completedRequests++;
                       onAjaxComplete(testObj);
                   }
               });
           }
           
           if(categoryCount == 0) promise();
        });
    },
    
    /** 
     * Returns stored test object through promise function.
     * @param {int} refId Reference id of the requested test.
     * @param {Function} promise Function to call after processing.
     */
    getStoredTest: function(refId, promise) {
        this.getStoredTestObject(function(testObj) {
            if(typeof testObj[refId] == 'undefined') {
                promise(null);
            } else {
                promise(testObj[refId].questions);
            }
        });
    },
    
    /** 
     * Returns stored question array through promise function.
     * @param {int} refId Reference id of the requested test.
     * @param {Function} promise Function to call after processing.
     */
    getStoredQuestions: function(refId, promise) {
        var me = this,
            questionObj = [];

        me.getStoredTestObject(function(storedTests) {            
            me.getStoredQuestionObject(function(storedQuestions) {
                if(typeof storedQuestions[refId] !== 'undefined') {
                    if(storedTests[refId].isRandomTest)  {                    
                        storedTests[refId].questions.forEach(function(question) {
                            if(Ext.Array.contains(storedQuestions[refId], parseInt(question.id))) {
                                questionObj.push(question);
                            }
                        });
                    } else questionObj = storedQuestions[refId].questions;
                }
                promise(questionObj);
            });
        });
    },
    
    /** 
     * Removes stored questions from local database.
     * @param {Object} categories Object with categorie refIds to remove.
     * @param {Function} promise Function to call after processing.
     */
    removeStoredQuestions: function(categories, promise) {
        var me = this;
                
        me.getStoredQuestionObject(function(questionObj) {
            for(var category in categories) delete questionObj[category];
            me.setStoredQuestionObject(questionObj, promise);
        });
    },
    
    /** 
     * Removes selected categories from local database.
     * @param {Object} deletedCategories Object with categorie refIds to remove.
     * @param {Function} promise Function to call after processing.
     */
    removeStoredCategories: function(deletedCategories, promise) {
        var me = this;
        
        /** recusivly remove parent categories */
        var checkAndRemoveParent = function(delCat, categories) {
            if(delCat.parent !== 0 && typeof categories[delCat.parent] !== 'undefined') {
                checkAndRemoveParent(categories[delCat.parent], categories);
                delete categories[delCat.parent];
            }
        };
        
        me.getStoredCategories(function(categories) {
            for(var cat in categories) {
                for(var deletedCat in deletedCategories) {
                    if(deletedCat == cat) {
                        checkAndRemoveParent(categories[cat], categories);
                        delete categories[cat];
                    }
                }
            }
            
            me.removeStoredQuestions(deletedCategories, function() {
                me.setStoredCategories(categories, promise);
            });
        });
    },
    
    /** 
     * Stores an value to settingsObject[settingsKey].
     * @param {String} settingsKey Id of setting to store in settingsObject.
     * @param {int} value Value of setting to store in settingsObject.
     */
    storeSetting: function(settingsKey, value) {
        var me = this;
        
        me.getStoredSettingsObject(function(settingsObject) {
            settingsObject[settingsKey] = value;
            me.setStoredSettingsObject(settingsObject);
        });
    },
    
    /** 
     * Returns a value of a requested setting through a promise.
     * @param {String} settingsKey Id of setting to retrieve from settingsObject.
     * @param {promise} promise Function to call after processing.
     */
    getStoredSetting: function(settingsKey, promise) {
        var me = this;
        
        me.getStoredSettingsObject(function(settingsObject) {
            promise(settingsObject[settingsKey]);
        });
    }
});