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
            
    /** getter for storedTree */
    getStoredIndexTreeObject: function(promise) {
        localforage.getItem('storedTree').then(promise);
    },
    
    /** setter for storedTree */
    setStoredIndexTreeObject: function(object, promise) {
        localforage.setItem('storedTree', object).then(promise);
    },
    
    /** getter for storedTests */
    getStoredTestObject: function(promise) {
        localforage.getItem('storedTests').then(promise);
    },
    
    /** setter for storedTests */
    setStoredTestObject: function(object, promise) {
        localforage.setItem('storedTests', object).then(promise);
    },
    
    /** getter for selectedCategories */
    getStoredCategories: function(promise) {
        localforage.getItem('selectedCategories').then(promise);
    },
    
    /** setter for selectedCategories */
    setStoredCategories: function(object, promise) {
        localforage.setItem('selectedCategories', object).then(promise);
    },
    
    /** getter for selectedQuestions */
    getStoredQuestionObject: function(promise) {
        localforage.getItem('selectedQuestions').then(promise);
    },
    
    /** setter for selectedQuestions */
    setStoredQuestionObject: function(object, promise) {
        localforage.setItem('selectedQuestions', object).then(promise);
    },
    
    /** getter for preferences */
    getStoredSettingsObject: function(promise) {
        localforage.getItem('preferences').then(promise);
    },
    
    /** setter for preferences */
    setStoredSettingsObject: function(object, promise) {
        localforage.setItem('preferences', object).then(promise);
    },
    
    /** getter for lastUpdate */
    getStoredTimestamp: function(promise) {
        localforage.getItem('lastUpdate').then(promise);
    },
    
    /** setter for lastUpdate */
    setStoredTimestamp: function(value, promise) {
        localforage.setItem('lastUpdate', value).then(promise);
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
     * Stores timestamp of last update from backend.
     * @param {Function} promise Function to call after processing.
     */
    storeLastUpdate: function(promise) {
        var date = new Date();
        
        this.setStoredTimestamp(date.getTime(), promise);
    },
    
    /** 
     * Returns the number of days since last update.
     * @param {Function} promise Function to call after processing.
     */
    getLastUpdateInDays: function(promise) {
        var date = new Date(),
            oneDay = 1000 * 60 * 60 * 24;
        
        this.getStoredTimestamp(function(timestamp) {
            if(timestamp == null) promise(LernApp.app.daysToReloadData);
            else promise(Math.round((date.getTime() - timestamp) / oneDay));
        });
    },
    
    /** 
     * Store card index tree from backend database to local database.
     * @param {Function} promise Function to call after processing.
     */
    storeCardIndexTree: function(promise) {
        var me = this;
            online = true;            
        
        var onlineMode = function(tree) {
            me.setStoredIndexTreeObject(tree, function(tree) {
                promise(tree, online)
            });
        };
        
        var offlineMode = function() {
            me.getStoredIndexTreeObject(function(tree) {
                promise(tree, !online);
            });
        }
        
        me.getLastUpdateInDays(function(days) {
            if(days >= LernApp.app.daysToReloadData) {
                LernApp.app.proxy.getCardIndexTree({
                    success: onlineMode,
                    failure: offlineMode
                });
            } else {
                offlineMode();
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
                        var randomIds = {};
                        questionIds[category] = new Array();
                        
                        while(Object.keys(randomIds).length < cat.randomQuestionCount) {
                            var value = Math.floor(Math.random() * cat.questionCount);
                            randomIds[value] = true;
                        }

                        for(id in randomIds) {
                            questionIds[category].push(questionSet[id]);
                        }
                    }
                    else questionIds[category] = questionSet;
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
                me.storeLastUpdate(function() {
                    me.setStoredTestObject(testObj, promise);
                });
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
                       var cat = categories[test.refId],
                           questions = {};
                       
                       test.data.forEach(function(question) {
                           questions[question.id] = question;
                       });
                       
                       testObj[test.refId] = {
                           title: cat.title,
                           questions: questions,
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
     * Returns stored tests which are selected in selectedCategories.
     * @param {Function} promise Function to call after processing.
     */
    getSelectedStoredTests: function(promise) {
        var me = this,
            obj = {};
        
        this.getStoredCategories(function(cat) {
            me.getStoredTestObject(function(testObj) {
                for(var key in cat) {
                    if(key in testObj) obj[key] = testObj[key];
                }
                promise(obj);
            });
        });
    },
    
    /** 
     * Returns stored question object through promise function.
     * @param {int} refId Reference id of the requested test.
     * @param {Function} promise Function to call after processing.
     */
    getStoredQuestions: function(refId, promise) {
        var me = this,
            questionObj = [];

        me.getStoredTestObject(function(storedTests) {            
            me.getStoredQuestionObject(function(storedQuestions) {
                if(typeof storedQuestions[refId] !== 'undefined') {
                    if(storedTests[refId].isRandomTest) {
                        for(var key in storedTests[refId].questions) {
                            if(Ext.Array.contains(storedQuestions[refId], parseInt(key))) {
                                questionObj.push(storedTests[refId].questions[key]);
                            }
                        }
                    } else {
                        questionObj = Object.keys(storedTests[refId].questions).map(function(key) {
                            return storedTests[refId].questions[key];
                        });
                    }
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