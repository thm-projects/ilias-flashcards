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
        'Ext.Button'
    ],
    
    config: {
        title: Messages.LEARN_CARD,
        fullscreen: true
    },
    
    instanciateComponents: function() {
        var panel = [];
        
        for(var key in this.questions) {
            panel.push(Ext.create('LernApp.view.learncard.QuestionPanel', {
                questionObj: this.questions[key]
            }));
        }
        this.add(panel);
    },
    
    initialize: function(arguments) {
        this.callParent(arguments);
        
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
                
                /** quickhack */
                var sel = activeItem.answerList.getSelection()[0].data.points;
                
                navigation.saveAnimation();
                navigation.getNavigationBar().down('#answerButton').hide();
                navigation.getLayout().setAnimation({ type: 'flip', duration: 500 });
                
                navigation.push( Ext.create('LernApp.view.learncard.AnswerPanel', { 
                    answers: activeItem.questionObj.answers,
                    feedback: activeItem.questionObj.feedback,
                    selection: sel 
                }));
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
            if(!this.showOnly) LernApp.app.main.navigation.getNavigationBar().down('#answerButton').show();
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
    }
});
