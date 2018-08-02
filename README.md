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


Heatmap used the JSON Object matrix:
```
matrix={
  data:[],
  labels:{
    rows:[],
  	columns:[]
  }
}
```

The size of the heatmap (cols x rows) based on the labels.
Then the data is a an array of arrays with the data of each row. So data[0] would give you the data for the first (Top) row.
Each data point is a JSON object with the colour and the title information.
So: 
```
data[0][0]={
	color: 'green';
	title: 'OK';
}
```