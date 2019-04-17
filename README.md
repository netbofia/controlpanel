# controlpanel
A control panel app to check servers are up and running

Add a JSON with configurations in components/hosts

Example JSON for adding a server
```
{
	"scheme" : "https",
	"port":"443",
	"host":"",
	"path":"areyouup?"
}
```
The default path for checking my servers is areyouup but you can set it any other and check it's status code.
This configuration by default expects a "yes" response but you can set it to anything else by changing the expectedResponse in /components/checkhosts.js. If the path can't be resolved a notification will be sent.

The log will appear as as [host].log in components/hosts

Add the unit files in components/cron to set systemd timer
or link them with: 
```
systemctl link /abs/path
```

Telegram notification
=====================
Create the bot by talking to the @BotFather
/newbot set it up
/token  to generate the token for the previously setup bot.

Then setup the token in config_telegram.js
```
module.exports = {
	token: 'yourtokenhere',
	chatid: 'thedesiredchatid'
}
```
Set the chat id in components/cron/sendtelegram.js

Heatmap
=======

The heatmap uses a JSON Object (matrix) to load its data:
```
matrix={
  data:[],
  labels:{
    rows:[],
  	columns:[]
  }
}
```

The size of the heatmap, (cols x rows) is based on the size of the matrix.data array. 
Data is organized as an array of arrays, with the data of each row in its respective array. 
The number of arrays in data corresponds to the number of rows, and the number of columns corresponds to the number of elements in the first array.
Basically data[0] would give you the data for the first (Top) row.

Each data point is a JSON object with the colour and the title information: 
```
data[0][0]={
	color: 'green';
	title: 'OK';
}
```

Automatically restarting the server
===================================

To restart the webserver add the file:
restartWebServer to /usr/local/bin
with the command: 
```
systemctl restart [serviceName].service

sudo echo "systemctl restart [serviceName].service" > /usr/local/bin/restartWebServer
sudo chmod 700 /usr/local/bin/restartWebServer

```

Now allowing the server to run this command without a password
```
sudo visudo -f /etc/sudoers.d/restartWebServer

[user] [host] = (root) NOPASSWD: /usr/local/bin/restartWebServer
```
Make sure to use visudo so you don't lock yourself out of sudo rights.
Replace [user] and [host] with the appropriate user and host to allow execution. You can actually set host to ALL.

Now you can ssh your server and restart the webserver

Future changes
==============
Upcoming strategy, if a failure is detected. The app should test every minute and attempt to restart server on the x=5th try (With timeout not systemd).
Send notification if it was successful and go back to normal cycle. Set failure in heatmap for that hour.

Set panel with config of hosts.

Split into several panels.

Lazy load heatmaps.

Load into memory only last 7 days of temp heatmap matrix.



