ILIAS-Flashcards
==========

ILIAS-Flashcards is a digital quiz and flashcard application. Used together with a
connector software, the [arsnova- connector](https://github.com/thm-projects/arsnova-lms-connector),
this application can be utilized to show questions and tests from the open source e-learning plattform [Ilias](http://www.ilias.de/) from any HTML5 capable device. It is released under the GPLv3 license. 

In order to support offline storage of the mentioned questions and tests, ILIAS-flashcards uses [localforage](https://github.com/mozilla/localForage) as local asynchronous storage. After
registering on the connector software via LDAP, the application can be used completely and
unconditionally offline. Only the expiration of the login data (usally after 14 days) and
updates of questions or tests might require a fresh connection to the connector software.

### Requirements

This application uses Sencha Touch 2 as application framework. In order to build
the software you have to install Sencha Cmd 4. The basic requirement for installing
and using Sencha Cmd is the presence of Ruby and Java Runtime Environment 1.7 (or newer).
Before you continue, please ensure that all requirements are installed properly.

The download links to the referred requirements, as well as the installation
guide for Sencha Cmd can be found here:

- [Download Sencha Cmd](https://www.sencha.com/products/extjs/cmd-download/)
- [Sencha Cmd documentation](http://docs.sencha.com/cmd/5.x/intro_to_cmd.html)
  (see subsection "System Setup")

### Building

Ilias-Flashcards is built through Sencha Cmd by running:

	cd /path/to/application
	sencha app build

During this process a folder called *build* with a subfolder *production* will 
be created inside the project folder. The content of this subfolder can be moved
directy to a HTTP server installation or manually packed to a web application archive.

## Connector

This software can be used as standalone software with local data, but is also
capable to use the service API of the [arsnova-connector](https://github.com/thm-projects/arsnova-lms-connector) in order to retrieve questions and tests from the ILIAS e-learning platform.

###Requirements

The basic requirement for building the [arsnova-connector](https://github.com/thm-projects/arsnova-lms-connector)
software is the presence of Java Runtime Environment 1.7 (or newer) and gradle.
Before you continue, please ensure that all requirements are installed properly.

- [Download gradle](http://gradle.org/gradle-download/)

### Building

The build process of the connector software is conducted by gradle. Just run:

	gradle clean build

inside the project folder. This creates the archive `connector-service.war` 
in the `connector-service/build/libs` directory, which can be directly deployed
to a servlet container.

In order to use the custom connector service, the http address and port have to be
configured inside the `app/proxy/Proxy.js` file of the client project. Afterwards
a fresh build of the client software is required.

