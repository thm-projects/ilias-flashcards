/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/learncard/CardCarousel.js
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

Ext.define('LernApp.view.learncard.CardCarousel', {
    extend: 'Ext.Carousel',
    xtype: 'cardCarousel',

    requires: [
        'Ext.Button',
        'LernApp.view.learncard.QuestionPanel',
        'LernApp.view.learncard.AnswerPanel'
    ],
    
    config: {
        title: Messages.LEARN_CARD,
        itemId: 'CardCarousel',
        fullscreen: true
    },
    
    instanciateComponents: function() {
        var me = this,
            array = [],
            panelCounter = 0,
            questions = this.config.questions;
                  
        me.questionsArray = [];
        
        for(var key in questions) {
            if(++panelCounter < 10) {
                array.push(Ext.create('LernApp.view.learncard.QuestionPanel', {
                    itemId: questions[key].id,
                    questionObj: questions[key]
                }));
            }
            else if(panelCounter > 10) {
                me.questionsArray.push(questions[key]);
            }
        }
        
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
                var navigation = LernApp.app.main.navigation;
                var activeItem = navigation.getActiveItem().getActiveItem();
                
                /** get list selection */
                var sel = activeItem.answerList.getSelection();
                
                if(sel.length > 0) {
                    navigation.saveAnimation();
                    navigation.getNavigationBar().down('#answerButton').hide();
                    navigation.getLayout().setAnimation({ type: 'flip', duration: 500 });
                    
                    navigation.push( Ext.create('LernApp.view.learncard.AnswerPanel', {
                        boxId: me.config.boxId,
                        questionId: activeItem.config.questionObj.id,
                        questionType: activeItem.config.questionObj.type,
                        feedback: activeItem.config.questionObj.feedback,
                        answers: activeItem.config.questionObj.answers,
                        showOnlyAnswers: me.config.showOnlyAnswers,
                        selection: sel 
                    }));
                }
            }
        });
       
        /**
         * actions to perform after panel is activated
         */
        this.onAfter('activate', function() {
            /**
             * add answer button to navigationBar
             */
            LernApp.app.main.navigation.getNavigationBar().add(this.answerButton);
            if(!this.showOnlyQuestion) this.answerButton.show();
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
            LernApp.app.main.navigation.getNavigationBar().remove(this.answerButton); 
        });
    },
    
    disableActiveQuestion: function() {
        var questionPanel = this.getActiveItem();
        this.remove(questionPanel);
    },
    
    preloadQuestion: function() {
        if(this.questionsArray.length > 0) {
            if((this.getInnerItems().length - 3) == this.getActiveIndex()) {
                var question = this.questionsArray.pop();
                
                this.add([Ext.create('LernApp.view.learncard.QuestionPanel', {
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
                    LernApp.app.main.navigation.pop();
                }).delay(200);
            });
        }
    }
});
