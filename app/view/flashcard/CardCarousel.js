/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/flashcard/CardCarousel.js
  - Beschreibung:	Fragencarousel. 
  - Datum:			05.12.2013
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

Ext.define('LearningApp.view.flashcard.CardCarousel', {
    extend: 'Ext.Carousel',
    xtype: 'cardCarousel',

    requires: [
        'Ext.Button',
        'LearningApp.view.flashcard.QuestionPanel',
        'LearningApp.view.flashcard.AnswerPanel'
    ],
    
    config: {
        title: Messages.FLASHCARD,
        preloadedQuestionCount: 10,
        itemId: 'CardCarousel',
        fullscreen: true
    },
    
    instanciateComponents: function() {
        var me = this,
            array = [],
            panelCounter = 0,
            questions = this.config.questions;
                  
        me.questionsArray = [];
        me.statisticObject = {};
        
        for(var key in questions) {            
            if(panelCounter++ < this.config.preloadedQuestionCount) {
                array.push(Ext.create('LearningApp.view.flashcard.QuestionPanel', {
                    itemId: questions[key].id,
                    questionObj: questions[key],
                    showOnlyQuestion: me.config.showOnlyQuestion
                }));
            }
            else if(panelCounter > this.config.preloadedQuestionCount) {
                me.questionsArray.push(questions[key]);
            }
            
            me.statisticObject[panelCounter] = {
                reachedPoints: 0,
                maxPoint: questions[key].points
            };
        }
        
        /** reverse questionsArray in order to get the question 
         * in the right order when using pop */
        this.questionsArray.reverse();
        
        /** add preloaded questions to carousel */
        this.add(array);
    },
    
    initialize: function(arguments) {
        this.callParent(arguments);
        
        var me = this;
        
        this.disabledQuestions = 0;
        
        this.instanciateComponents();
        
        this.answerButton = Ext.create('Ext.Button', {
            ui: 'confirm',
            text: 'Antworten',
            id: 'answerButton',
            align: 'right',
            hidden: true,
            
            handler: function() {
                var navigation = LearningApp.app.main.navigation;
                var activeItem = navigation.getActiveItem().getActiveItem();
                
                /** get list selection */
                var sel = activeItem.answerList.getSelection();
                
                if(sel.length > 0) {
                    navigation.saveAnimation();
                    navigation.getNavigationBar().down('#answerButton').hide();
                    navigation.getLayout().setAnimation({ type: 'flip', duration: 500 });
                    
                    navigation.push( Ext.create('LearningApp.view.flashcard.AnswerPanel', {
                        boxId: me.config.boxId,
                        questionObj: activeItem.config.questionObj,
                        testMode: me.config.testMode,
                        selection: sel 
                    }));
                }
            }
        });
       
        /**
         * actions to perform after panel is activated
         */
        this.onAfter('activate', function() {
            LearningApp.app.main.cardCarousel = this;
            
            /** add answer button to navigationBar */
            LearningApp.app.main.navigation.getNavigationBar().add(this.answerButton);
        });
        
        /**
         * preload next question on active item change
         */
        this.on('activeitemchange', function() {
            this.preloadQuestion();
        });
        
        /**
         * actions to perform on panel deactivate
         */
        this.onBefore('deactivate', function() {
            this.answerButton.hide();
        });
        
        /**
         * actions to perform after panel is painted
         */
        this.onAfter('painted', function() {
            Ext.Viewport.setMasked(false);
        });
        
        /**
         * actions to perform on panel destroy
         */
        this.on('destroy', function() {
            console.log(this.statisticObject);
            LearningApp.app.main.navigation.getNavigationBar().remove(this.answerButton); 
            delete LearningApp.app.main.cardCarousel;
        });
    },
    
    removeActiveQuestion: function() {
        var questionPanel = this.getActiveItem();
        this.remove(questionPanel);
    },
    
    disableActiveQuestion: function() {
        this.getActiveItem().isAnswered = true;
        this.getActiveItem().answerList.setDisableSelection(true);
    },

    preloadQuestion: function() {
        if(this.questionsArray.length > 0) {
            if(     (this.getInnerItems().length - 3 == this.getActiveIndex())
                ||  (this.getInnerItems().length - 1 < this.config.preloadedQuestionCount)) {
                var question = this.questionsArray.pop();
                
                this.add([Ext.create('LearningApp.view.flashcard.QuestionPanel', {
                        itemId: question.id,
                        questionObj: question
                    })
                ]);
            }
        }
    },
    
    checkForEmptyItems: function() {
        if(this.getInnerItems().length === 0) {
            Ext.Msg.alert('', 'Keine weiteren Fragen vorhanden!', function() {
                Ext.create('Ext.util.DelayedTask', function () {
                    LearningApp.app.main.navigation.pop();
                }).delay(200);
            });
        }
    }
});
