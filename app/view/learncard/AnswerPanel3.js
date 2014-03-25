/*--------------------------------------------------------------------------------+
  - Dateiname:		app/view/learncard/AnswerPanel.js
  - Beschreibung:	AnswerPanel. 
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

Ext.define('LernApp.view.learncard.AnswerPanel3', {
    extend: 'Ext.Panel',
    xtype: 'answerPanel3',

    requires: [
        'Ext.dataview.List'
    ],
    
    config: {
        title: Messages.ANSWER,
        fullscreen: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        }
    },
    
    constructor: function(args) {
        this.callParent(args);
        this.selection = (args.selection === 'Art. 9 Abs. 1 GG (funktionierendes Vereinswesen)');
        if(this.selection) {
            Ext.Msg.alert('Richtig!', 'Die Antwort war richtig.', Ext.emptyFn);
        } else {
            Ext.Msg.alert('Falsch!', 'Die Antwort war leider falsch.', Ext.emptyFn);
        }
    },
    
    initialize: function() {
        this.callParent(arguments);
        
        var me = this;
        
        this.saveButton = Ext.create('Ext.Button', {
            text: 'Speichern',
            ui: 'confirm',
            handler: function() {
                var saveConfirmPanel = LernApp.app.main.navigation.getActiveItem().saveConfirmPanel;
                var main = LernApp.app.main;
                var answerPanel = main.navigation.getActiveItem();
                
                /** disable saveButton */
                this.disable();

                if(answerPanel.selection) {
                    /** 
                     * show confirm panel over saveButton,
                     * align panel slightly over the button,
                     * mask out navigation view
                     */
                    saveConfirmPanel.showBy(this, 'bc-tc');
                    saveConfirmPanel.setTop(saveConfirmPanel.getTop() - 10);
                    LernApp.app.main.navigation.getActiveItem().mask();
                    saveConfirmPanel.show();
                } else {
                    /** show loadmask 'saving' */
                    Ext.Viewport.setMasked({ xtype:'loadmask', message: Messages.SAVING });
                    
                    /** 
                     * remove saveButton from tab bar,
                     * unhide all tabs in tab panel,
                     * pop answer panel from navigation view
                     */
                    main.tabPanel.getTabBar().remove(answerPanel.saveButton);
                    main.tabPanel.showAllTabs();
                    main.navigation.pop();
                }
            }
        });
        
        this.saveConfirmFieldSet = Ext.create('Ext.form.FieldSet', {
            cls: 'standardForm',
            style: 'margin-top: 2px',
        
            defaults: {
                xtype: 'button',
                badgeCls: 'saveAnswerButtonBadge',
                handler: function(button) {                    
                    var main = LernApp.app.main;
                    var answerPanel = main.navigation.getActiveItem();
                    
                    /** save answer to database */
                    answerPanel.saveAnswer(button);
                    answerPanel.saveConfirmPanel.hide();
                }
            },
            
            items: [
                {
                    text: Messages.DIFFICULT,
                    badgeText: Messages.IN_THIS_SESSION
                }, {
                    text: Messages.COULD_BE_WORSE,
                    badgeText: Messages.IN_NEXT_SESSION
                }, {
                    text: Messages.EASY,
                    badgeText: Messages.AFTER_NEXT_SESSION
                }, {
                    text: Messages.LEARNED,
                    badgeText: Messages.NO_REPEAT
                }
            ]
        });
        
        this.saveConfirmPanel = Ext.create('Ext.Panel', {
            top: -1000,
            hidden: true,
            cls: 'saveConfirmPanel',
            
            showAnimation: {
                type: 'slideIn',
                duration: 800,
                direction: 'down'
            },
            
            hideAnimation: {
                type: 'slideOut',
                duration: 800,
                direction: 'up',
                listeners: {
                    animationend: function() {
                        var main = LernApp.app.main;
                        var answerPanel = main.navigation.getActiveItem();
                        
                        /** show loadmask 'saving' */
                        Ext.Viewport.setMasked({ xtype:'loadmask', message: Messages.SAVING });
                        
                        /** destroy saveConfirmPanel */
                        answerPanel.saveConfirmPanel.destroy();
                        
                        /** 
                         * remove saveButton from tab bar,
                         * unhide all tabs in tab panel,
                         * pop answer panel from navigation view
                         */
                        main.tabPanel.getTabBar().remove(answerPanel.saveButton);
                        main.tabPanel.showAllTabs();
                        main.navigation.pop();
                    }
                }
            },  

            items: [
                {
                    xtype: 'label',
                    cls: 'selfAssessmentLabel',
                    html: Messages.SELF_ASSESSMENT
                },
                {
                    xtype: 'button',
                    text: Messages.DIFFICULTY,
                    cls: 'selfAssessmentInstruction',
                    badgeCls: 'saveAnswerButtonBadge',
                    badgeText: Messages.REQUEST_AGAIN
                },
                this.saveConfirmFieldSet
            ]
        });
        
        this.answerTitle = Ext.create('Ext.Panel', {
            cls: 'roundedBox',
            html: 
                '<p class="title">' + Ext.util.Format.htmlEncode('Richtige Antwort:') + '<p/><br>' +
                '<p><it>' + Ext.util.Format.htmlEncode('"Art. 9 Abs. 1 GG (funktionierendes Vereinswesen)"') + '</it></p>'
        });
        
        this.answerBox = Ext.create('Ext.Panel', {
            cls: 'roundedBox',
            html: 
                '<p class="title">' + Ext.util.Format.htmlEncode('Hinweis:') + '<p/><br>' +
                '<p>' + Ext.util.Format.htmlEncode('Vgl. Pieroth/Schlink, Grundrechte, Rn. 88 ff.; Hufen, Staatsrecht II Grundrechte, § 5 Rn. 17 f.') + '</p>'
        });
        
        this.add([
            this.answerTitle,
            this.answerBox
        ]);
        
        /**
         * actions to perform after panel is painted
         */
        this.onBefore('painted', function() {
            LernApp.app.main.navigation.getNavigationBar().getBackButton().hide();
            LernApp.app.main.tabPanel.getTabBar().add(this.saveButton);
            LernApp.app.main.tabPanel.hideAllTabs();
        });
           
        /**
         * actions to perform before panel is destroyed
         */
        this.onBefore('destroy', function() {
            /** restore back button of navigation bar */
            LernApp.app.main.navigation.getNavigationBar().getBackButton().show();
            
            /** destroy loadingmask and restore saved animation */
            var task = Ext.create('Ext.util.DelayedTask', function () {
                Ext.Viewport.setMasked(false);
                LernApp.app.main.navigation.getLayout().setAnimation(
                    LernApp.app.main.navigation.getSavedAnimation()
                );
            });
            
            task.delay(1000);
        });
    },
    
    /**
     * TODO: implement save answer to database
     */
    saveAnswer: function(button) {
        console.log('saved: ' + button.getText());
    }
});
