# controlpanel
A control panel app to check servers are up and running

Add a json with configurations in components/hosts

Example json for adding a server
```
{
	"scheme" : "https",
	"port":"443",
	"host":"",
	"path":"areyouup?"
}
```

The log will appear as as [host].log in components/hosts

Add the unit files in components/cron to set systemd timer

