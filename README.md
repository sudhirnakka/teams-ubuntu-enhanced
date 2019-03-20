## LICENSE ##
[MIT License](https://raw.githubusercontent.com/sudhirnakka/teams-ubuntu-enhanced/master/LICENSE)

### Usage:
* You can download the artifacts from release page
    * Debian and direct electron packages are available for use
* Post installation, launch the application and login with your teams credentials
* Once authenticated, the credentials will be reused on subsequent launches

### Modifying, Building the code yourself
* Project is like any other npm code base.
* ``npm install`` & ``npm start`` would start the application in development mode
* ``npm run dist & npm run deb`` will generate the electron packages along with a deb file

### Enhanced features
* Provides native OS notifications
* Highlights unread message from users with a background color for easier readability
* Supports video-calling

### Features to work upon
* Support screensharing
* Support optional notification audio note
* Unread notifications replay


### Project reference:
* All thanks to: [Leftstick](https://github.com/leftstick/teams-ubuntu) for the scratch code-base
* A fork-PR will be made in near future to the parent project on which these enhancements were made.