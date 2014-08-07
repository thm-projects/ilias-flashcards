/*--------------------------------------------------------------------------------+
  - Dateiname:		app/internationalisation.js
  - Beschreibung:	Platzhalter für zukünftige Übersetzung der App. 
  - Datum:			25.11.2013
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

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;
var isChrome = ua.indexOf("chrome") > -1;
var lang;

/**
 * Check language on android devices.
 */
if(isAndroid && !isChrome) {
    if ( navigator && navigator.userAgent && (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
            lang = lang[1];
    }
} else {
    lang = navigator.language;
}

var prefLang = localStorage.getItem("language");
if(prefLang != undefined){
    lang = prefLang;
}

if(lang != null) {
    lang = lang.toLowerCase();
}

switch (lang) {
    default:
        Messages = {
            YES: 'Ja',
            NO: 'Nein',
            BACK: 'Zurück',
            HELP: 'Hilfe',
            WELCOME: 'Willkommen',
            ATTENTION: 'Achtung',
            LOGIN: 'Login',
            HOME: 'Home',
            ANSWER: 'Antwort',
            CONTINUE: 'Fortsetzen',
            PERSONAL_DATA: 'Ihre Daten:',
            LOGIN_DATA: 'Bitte geben Sie Ihre Login-Daten ein.',
            LOGIN_FAILED: 'Login leider nicht erfolgreich.',
            USERNAME: 'Benutzername',
            PASSWORD: 'Password',
            LOGOUT: 'Logout',
            SAVING: 'Speichere...',
            LOADING: 'Lade...',
            OVERVIEW: 'Übersicht',
            TESTOVERVIEW: 'Test Übersicht',
            SETTINGS: 'Einstellungen',
            QUESTION: 'Frage',
            USER: 'User',
            CAROUSEL: 'Carousel',
            FIRST_BOX: '1. Kasten',
            SECOND_BOX: '2. Kasten',
            THIRD_BOX: '3. Kasten',
            NOTIFICATIONS: 'Benachrichtigungen',
            LEARN_INTERVAL: 'Lernintervalle',
            LEARN_CARD: 'Lernkarten',
            CARD_INDEX: 'Fragenkatalog',
            LEARN_LEARN_CARDS: 'Lernen',
            SHOW_LEARN_CARDS: 'Durchblättern',
            SHOW_RANDOM_CARDS: 'Zufallstest generieren',
            SHOW_CARD_INDEX: 'Anzeigen',
            EDIT_CARD_INDEX: 'Auswählen',
            FEATURE_COMING_SOON: 'In der Vorschau noch nicht vorhanden',
            CONNECTION_ERROR: 'Momentan ist keine Verbindung zum Server möglich. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut.',
            DELETION_NOTICE: 'Wenn Sie eine Kategorie löschen, werden die dazugehörigen Unterkategorien ebenfalls gelöscht. Möchten Sie fortfahren?',
            
            VIEW: 'Ansicht',
            TREE: 'Hierarchisch',
            TEST: 'Nur Tests',
            VIEW_OPTIONS: 'Ansichtseinstellung',
            DIFFICULTY: 'Schwierigkeit',
            REQUEST_AGAIN: 'Erneute Abfrage',
            IN_THIS_SESSION: 'Diese Session',
            IN_NEXT_SESSION: 'Nächste Session',
            AFTER_NEXT_SESSION: 'Übernächste Session',
            NO_REPEAT: 'Keine Wiederholung',
            SELF_ASSESSMENT: 'Selbsteinschätzung',
            PLEASE_CHOOSE: 'Bitte wählen Sie zuerst eine oder mehrere Kategorien im Menüpunkt "Auswählen".',
            
            /** temporary */
            CHANGE: 'Ändern',
            CANCEL: 'Abbrechen',
            CHOOSE: 'Auswählen',
            CATEGORYS: 'Kategorien',
            ALL_CATEGORYS: 'Alle Kategorien',
            CHANGE_CATEGORY: 'Kategorie ändern',
            PUBLIC_LAW: 'Öffentliches Recht',
            CRIMINAL_LAW: 'Strafrecht',
            CIVIL_LAW: 'Zivilrecht',
            
            FLASHCARD_BOXES: 'Lernkartei Fächer',  
            FLASHCARD_NOTEDITED: 'Unbearbeitet',
            FLASHCARD_EASY: 'Leicht',
            FLASHCARD_COULD_BE_WORSE: 'Geht so',
            FLASHCARD_DIFFICULT: 'Schwer',
            FLASHCARD_LEARNED: 'Erlernt',
            
            FLASHCARD_BOX1: 'Fach 1:',
            FLASHCARD_BOX2: 'Fach 2:',
            FLASHCARD_BOX3: 'Fach 3:',
            FLASHCARD_BOX4: 'Fach 4:',
            FLASHCARD_BOX5: 'Fach 5:'
        }
}