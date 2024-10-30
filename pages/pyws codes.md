- basic WebScrap snippet-
	- ```python
	  import requests
	  from bs4 import BeautifulSoup
	  
	  web = requests.get(" Web url ")
	  
	  # print(web) --> Show The responce code of web page
	  # web.content --> it shows rough format
	  # web.status_code --> Shows status code
	  
	  soup = BeautifulSoup(web.content, "html.parser" )
	  soup.prettify # This is change into right format
	  soup.title.name # this will Show title name
	  soup.body # all body contant
	  soup.find("h1") # this show 
	  ```
-
-