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
    },
    
    getStoredQuestionObject: function(promise) {
        localforage.getItem('storedQuestions').then(promise);
    },
    
    setStoredQuestionObject: function(value, promise) {
        localforage.setItem('storedQuestions', value).then(promise);
    },
    
    getStoredTestObject: function(promise) {
        localforage.getItem('storedTests').then(promise);
    },
    
    setStoredTestObject: function(value, promise) {
        localforage.setItem('storedTests', value).then(promise);
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
                    }  questionIds[category] = questionSet;
                }
            } me.setStoredQuestionObject(questionIds, promise);
        });
    },
    
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
    
    getStoredTest: function(refId, promise) {
        this.getStoredTestObject(function(testObj) {
            if(typeof testObj[refId] == 'undefined') {
                promise(null);
            } else {
                promise(testObj[refId].questions);
            }
        });
    },
    
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
    
    removeStoredQuestions: function(categories, promise) {
        var me = this;
                
        me.getStoredQuestionObject(function(questionObj) {
            for(var category in categories) delete questionObj[category];
            me.setStoredQuestionObject(questionObj, promise);
        });
    },
    
    removeStoredCategories: function(deletedCategories, promise) {
        var me = this;
        
        me.getStoredCategories(function(categories) {
            for(var cat in categories) {
                for(var deletedCat in deletedCategories) {
                    if(deletedCat == cat) delete categories[cat];
                }
            }
            
            me.removeStoredQuestions(deletedCategories, function() {
                me.setStoredCategories(categories, promise);
            });
        });
    }
});