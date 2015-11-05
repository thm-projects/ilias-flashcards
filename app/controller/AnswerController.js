/*--------------------------------------------------------------------------------+
  - Dateiname:      app/controller/AnswerController.js
  - Beschreibung:   Login-Controller
  - Datum:          28.04.2014
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
Ext.define('LearningApp.controller.AnswerController', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            
        },
        control: {
            
        }
    },
    
    /**
     * Login handler. Tries to connect to specified server application
     * and performs steps on success or failure.
     * 
     * @param: uname - entered username
     * @param: upass - entered password
     * @param: loginPanel - panel where login credentials have been entered
     */
    saveAnswerToDatabase: function(questionId, flashcardBoxId, promise) {
        var me = this,
            flashcardEntry = {};
        
        /** remove question from flashcard set */
        LearningApp.app.storageController.getFlashcardObject(function(flashcardObject) {
            for(boxId in flashcardObject) {
                var box = flashcardObject[boxId];
                
                if(typeof box[questionId] !== "undefined") {
                    flashcardEntry = box[questionId];
                    delete box[questionId];
                }
            }
            
            /** set value of question entry to flashcard box */
            var flashcardBox = flashcardObject[flashcardBoxId];
            flashcardBox[questionId] = flashcardEntry;
            
            /** store modified flashcard object to local database */
            LearningApp.app.storageController.setFlashcardObject(flashcardObject, function() {
                LearningApp.app.main.navigation.getInnerItems().forEach(function(item) {
                    if(item.getTitle() === Messages.FLASHCARD_BOX) {
                        LearningApp.app.main.navigation.userPanel.loadAllStores();
                        item.updateFlashcardObject(flashcardObject);
                        me.removeActiveItemInCarousel();
                        promise();
                    }
                });
            });
        });
    },
    
    disableActiveItemInCarousel: function() {
        var panel = LearningApp.app.main.cardCarousel,
        index = panel.getActiveIndex();
        
        panel.disableActiveQuestion();
        panel.next();
    },
    
    removeActiveItemInCarousel: function() {
        var panel = LearningApp.app.main.cardCarousel,
        index = panel.getActiveIndex();
    
        panel.removeActiveQuestion();
        panel.setActiveItem(index);
        panel.checkForEmptyItems();
    }
});
