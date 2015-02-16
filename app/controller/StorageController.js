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
    
    username: null,
    
    /** initialize storage at startup */
    init: function() {
        this.initializeStorage();
    },
    
    /** intialization of storage */
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
        
        /** initalize 'initialized' object */
        localforage.getItem('initialized', function(isInitialized) {
            if(isInitialized == null) {
                localforage.setItem('initialized', new Object());
            }
        });
    },
    
    /** user specific initialization */
    initializeUserStorage: function(username, promise) {
        var me = this;
        
        localforage.getItem('initialized', function(initObject) {
            if(typeof initObject[username] === 'undefined') {
                
                /** set initialized object */
                initObject[username] = true;
                localforage.setItem('initialized', initObject);
                me.setStoredTimestamp(null);
                
                /** initialize storedSettingsObject */
                me.setStoredSettingsObject(new Object());
                
                /** initialize storedTestObject */
                me.setStoredTestObject(new Object());
                
                /** initialize storedCategoriesObject */
                me.setStoredCategories(new Object());
                
                /** initialize storedIndexTreeObject */
                me.setStoredIndexTreeObject(new Object());
                
                /** initialize storedQuestionIdObject */
                me.setStoredQuestionIdObject(new Object());
                
                /** initialize allSelectedQuestionsObject */
                me.setAllSelectedQuestionsObject(new Object());
                
                /** inizialize flashcardObject */
                me.setFlashcardObject({
                    box1: {}, box2: {},  box3: {}, box4: {}, box5: {}
                }, promise);
            } else {
                promise();
            }
        });
    },
    
    /** session specific initialization */
    initializeSession: function(promise) {
        var me = this;
        
        this.getLoggedInUserObj(function(userObj) {
            me.setUsername(userObj.user);
        });
    },
    
    /** getter for username */
    getUsername: function() {
        return this.username;
    },
    
    /** setter for local username */
    setUsername: function(username) {
        this.username = username;
    },
                
    /** getter for storedTree */
    getStoredIndexTreeObject: function(promise) {
        this.genericGetterMethod('storedTree', promise);
    },
    
    /** setter for storedTree */
    setStoredIndexTreeObject: function(object, promise) {
        this.genericSetterMethod('storedTree', object, promise);
    },
    
    /** getter for storedTests */
    getStoredTestObject: function(promise) {
        this.genericGetterMethod('storedTests', promise);
    },
    
    /** setter for storedTests */
    setStoredTestObject: function(object, promise) {
        this.genericSetterMethod('storedTests', object, promise);
    },
    
    /** getter for selectedCategories */
    getStoredCategories: function(promise) {
        this.genericGetterMethod('selectedCategories', promise);
    },
    
    /** setter for selectedCategories */
    setStoredCategories: function(object, promise) {
        this.genericSetterMethod('selectedCategories', object, promise);
    },
    
    /** getter for selectedQuestionIds */
    getStoredQuestionIdObject: function(promise) {
        this.genericGetterMethod('selectedQuestionIds', promise);
    },
    
    /** setter for selectedQuestionIds */
    setStoredQuestionIdObject: function(object, promise) {
        this.genericSetterMethod('selectedQuestionIds', object, promise);
    },
    
    /** getter for allQuestionsFromSelection */
    getAllSelectedQuestionsObject: function(promise) {
        this.genericGetterMethod('allQuestionsFromSelection', promise);
    },
    
    /** setter for allQuestionsFromSelection */
    setAllSelectedQuestionsObject: function(object, promise) {
        this.genericSetterMethod('allQuestionsFromSelection', object, promise);
    },
    
    /** getter for preferences */
    getStoredSettingsObject: function(promise) {
        this.genericGetterMethod('preferences', promise);
    },
    
    /** setter for preferences */
    setStoredSettingsObject: function(object, promise) {
        this.genericSetterMethod('preferences', object, promise);
    },
    
    /** getter for lastUpdate */
    getStoredTimestamp: function(promise) {
        this.genericGetterMethod('lastUpdate', promise);
    },
    
    /** setter for lastUpdate */
    setStoredTimestamp: function(object, promise) {
        this.genericSetterMethod('lastUpdate', object, promise);
    },
    
    /** setter for flashcardObject */
    getFlashcardObject: function(promise) {
        this.genericGetterMethod('flashCardSet', promise);
    },
    
    /** getter for flashcardObject */
    setFlashcardObject: function(object, promise) {
        this.genericSetterMethod('flashCardSet', object, promise);
    },
	
    /** getter for loggedInUser */
    getLoggedInUserObj: function(promise) {
        localforage.getItem('loginObj', function(loginObj) {
            promise(loginObj);
        });
    },
    
    /** setter for loggedInUser */
    setLoggedInUser: function(username, authObj, promise) {
        var me = this,
            date = new Date();
            obj = new Object();
                
        obj.user = btoa(username);
        obj.authObj = authObj;
        
        localforage.setItem('loginObj', obj, function() {
            me.setUsername(obj.user);
            localStorage.setItem('login', date.getTime());
            me.initializeUserStorage(obj.user, promise); 
        });
    },
    
    /** removes loginObj */
    removeLoggedInUser: function(promise) {
        localforage.removeItem('loginObj').then(promise);
    },
    
    /** returns login state */
    isUserLoggedIn: function() {
        var loginTimestamp = localStorage.getItem('login');

        return loginTimestamp;
    },
    
    /** generic getter method */
    genericGetterMethod: function(key, promise) {
        var me = this;
        localforage.getItem(key, function(obj) {
            promise(obj[me.username]);
        });
    },
    
    /** generic setter method */
    genericSetterMethod: function(key, value, promise) {
        var me = this;
        localforage.getItem(key, function(object) {
            if(object == null) object = {};
            
            object[me.username] = value;
            if(typeof promise === 'undefined') { localforage.setItem(key, object); }
            else { localforage.setItem(key, object, promise); }; 
        });
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
        var me = this,
            date = new Date(),
            oneDay = 1000 * 60 * 60 * 24;
        
        this.getStoredTimestamp(function(timestamp) {
            if(timestamp == null) promise(LernApp.app.daysUntilReloadData);
            else { promise(Math.round((date.getTime() - timestamp) / oneDay)); }
        });
    },
    
    /** 
     * Store card index tree from backend database to local database.
     * @param {Function} promise Function to call after processing.
     */
    storeCardIndexTree: function(promise) {
        var me = this,
            online = true;            
                
        var onlineMode = function(tree) {
            me.setStoredIndexTreeObject(tree, function(tree) {
                promise(online)
            });
        };
        
        var offlineMode = function() {
            me.getStoredIndexTreeObject(function(tree) {
                promise(!online);
            });
        };
        
        me.getLastUpdateInDays(function(days) {
            if(days >= LernApp.app.daysUntilReloadData) {
                LernApp.app.proxy.getCardIndexTree({
                    success: onlineMode,
                    failure: offlineMode
                });
            } else offlineMode();
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
            allQuestions = {},
            allQuestionIds = [];
        
        if(Object.keys(categories).length == 0) {
            promise();
            return;
        }
        
        me.getStoredQuestionIdObject(function(questionIds) {
            me.getStoredTestObject(function(testObj) {
                Object.keys(categories).map(function(category) {
                    if(categories[category].leaf) {
                        var cat = testObj[category];
                        
                        Object.keys(cat.questions).map(function(value, index) {
                            allQuestionIds.push(parseInt(value));
                            allQuestions[value] = cat.questions[value];
                        });
                        
                        var questionSet = Object.keys(cat.questions).map(function(key) {
                            return cat.questions[key].id;
                        });
                        
                        if(cat.isRandomTest && cat.randomQuestionCount > 0) {
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
                        else { questionIds[category] = questionSet; }
                    }
                });
                
                me.setStoredQuestionIdObject(questionIds, function() {
                    me.getAllSelectedQuestionsObject(function(selQuestionObject) {
                        Object.keys(allQuestions).map(function(questions) {
                            selQuestionObject[questions] = allQuestions[questions];
                        });
                        me.setAllSelectedQuestionsObject(selQuestionObject, promise);
                    });
                });
            });
        });
    },
    
    /**
     * Initial storage of questionIds for flashcardSet in local database.
     * @param {Array} questionIds List of questionIds to add to flashcardSet.
     * @param {String} flashcardBoxId ItemId of flashcardbox where questions should be saved.
     * @param {Function} promise Function to call after processing.
     */
    /**TODO: add questionstoflashcardset after test retrieval */
    storeQuestionsToFlashcardSet: function(questionIds, flashcardBoxId, promise) {
        var me = this,
            included = false,
            questionList = new Array();
        
        Object.keys(questionIds).map(function(testId) {
            questionList = questionList.concat(questionIds[testId]);
        });
        
        me.getFlashcardObject(function(flashcardObject) {
            questionList.forEach(function(questionId) {
                included = false;
                
                for(boxId in flashcardObject) {
                    var box = flashcardObject[boxId];

                    if(typeof box[questionId] !== "undefined") {
                        box[questionId]++;
                        included = true;
                    }
                }
                
                if(!included) {
                    var flashcardBox = flashcardObject[flashcardBoxId];
                    flashcardBox[questionId] = 1;
                }
            });
            
            me.setFlashcardObject(flashcardObject, promise);
        });
    },
    
    /** 
     * Filters all questionIds from questionList in local database from flashcardSet.
     * @param {Array} questionList List of question to remove from flashcardSet.
     * @param {Function} promise Function to call after processing.
     */
    filterQuestionsInFlashcardSet: function(questionList, promise) {
        var me = this;
        
        me.getFlashcardObject(function(flashcardObject) {
            questionList.forEach(function(questionId) {
                for(boxId in flashcardObject) {
                    var box = flashcardObject[boxId];
                    
                    if(typeof box[questionId] !== "undefined") {
                        box[questionId]--;
                        
                        if(box[questionId] < 1) {
                            delete box[questionId];
                        }
                    }
                }
            });

            me.setFlashcardObject(flashcardObject, promise);
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
                           leaf: true,
                           title: cat.title,
                           questions: questions,
                           id: parseInt(test.refId),
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
    getStoredSelectedTests: function(promise) {
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
            me.getStoredQuestionIdObject(function(storedQuestions) {
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
     * Returns a random set of stored questions through promise function.
     * The amount of random questions is specified in LernApp.app.randomQuestionCount.
     * @param {Function} promise Function to call after processing.
     */
    getRandomSetofStoredQuestions: function(promise) {
        var me = this,
            randomIds = {},
            randomQuestions = {};

        me.getAllSelectedQuestionsObject(function(allQuestions) {
            if(Object.keys(allQuestions).length) {
                var questionSet = Object.keys(allQuestions).map(function(key) {
                    return key;
                });
                
                while(Object.keys(randomIds).length < LernApp.app.randomQuestionCount) {
                    var value = Math.floor(Math.random() * Object.keys(allQuestions).length);
                    randomIds[value] = true;
                }
                
                for(id in randomIds) {
                    randomQuestions[questionSet[id]] = allQuestions[questionSet[id]];
                }
            }
            promise(randomQuestions);
        });
    },
    
    /** 
     * Removes selected and stored questions from local database.
     * @param {Array} Array of category ids.
     * @param {Function} promise Function to call after processing.
     */
    removeQuestionsFromSelection: function(categories, promise) {
        var me = this,
            questionList = new Array();
        
        me.getStoredTestObject(function(testObj) {
            me.getAllSelectedQuestionsObject(function(questionObj) {
                categories.forEach(function(id) {
                    for(var questionId in testObj[id].questions) {
                        delete questionObj[questionId];
                        questionList.push(parseInt(questionId));
                    }
                });
                
                me.filterQuestionsInFlashcardSet(questionList, function() {
                    me.setAllSelectedQuestionsObject(questionObj, promise);
                });
            });
        });
    },
    
    /** 
     * Removes stored questions from local database.
     * @param {Object} categories Object with categorie refIds to remove.
     * @param {Function} promise Function to call after processing.
     */
    removeStoredQuestions: function(categories, promise) {
        var me = this,
            leafCategories = [];
                
        me.getStoredQuestionIdObject(function(questionObj) {
            for(var category in categories) {
                if(questionObj.hasOwnProperty(category)) {
                    leafCategories.push(category);
                    delete questionObj[category];
                }
            }

            me.removeQuestionsFromSelection(leafCategories, function() {
                me.setStoredQuestionIdObject(questionObj, promise);
            });
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
            if(settingsObject.hasOwnProperty(settingsKey)) promise(settingsObject[settingsKey]);
            else promise(null);
        });
    }
});