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
        'LernApp.view.learncard.QuestionPanel2',
        'LernApp.view.learncard.QuestionPanel3',
        'LernApp.view.learncard.AnswerPanel',
        'LernApp.view.learncard.AnswerPanel2',
        'LernApp.view.learncard.AnswerPanel3'
    ],
    
    config: {
        title: Messages.LEARN_CARD,
        fullscreen: true
    },
    
    instanciateComponents: function() {
        this.q1 = Ext.create('LernApp.view.learncard.QuestionPanel');
        this.q2 = Ext.create('LernApp.view.learncard.QuestionPanel3');
        this.q3 = Ext.create('LernApp.view.learncard.QuestionPanel2');
    },
    
    initialize: function() {
        this.callParent(arguments);
        this.instanciateComponents();
        
        this.answerButton = Ext.create('Ext.Button', {
            ui: 'confirm',
            text: 'Antworten',
            align: 'right',
            id: 'answerButton',
            handler: function() {
                var navigation = LernApp.app.main.navigation;
                
                /** quickhack */
                var id = LernApp.app.main.navigation.getActiveItem().getActiveItem().getId();
                var sel = LernApp.app.main.navigation.getActiveItem().getActiveItem().answerList.getSelection()[0].data.text;

                navigation.saveAnimation();
                navigation.getNavigationBar().down('#answerButton').hide();
                navigation.getLayout().setAnimation({ type: 'flip', duration: 500 });
                
                switch(id) {
                    case 'questionPanel1': navigation.push( Ext.create('LernApp.view.learncard.AnswerPanel', { selection: sel })); break;
                    case 'questionPanel2': navigation.push( Ext.create('LernApp.view.learncard.AnswerPanel2', { selection: sel })); break;
                    case 'questionPanel3': navigation.push( Ext.create('LernApp.view.learncard.AnswerPanel3', { selection: sel })); break;
                }
            }
        });
   
        this.add([
            this.q1,
            this.q3,
            this.q2
        ]);
       
        /**
         * actions to perform after panel is activated
         */
        this.onAfter('activate', function() {
            /**
             * add answer button to navigationBar
             */
            LernApp.app.main.navigation.getNavigationBar().add(this.answerButton);
            LernApp.app.main.navigation.getNavigationBar().down('#answerButton').show();
        });
        
        /**
         * actions to perform on panel destroy
         */
        this.on('destroy', function() {
            this.q1.destroy();
            this.q2.destroy();
            this.q3.destroy();
            LernApp.app.main.navigation.getNavigationBar().remove(this.answerButton);
        });
    }
});
