Node js web site with local mysql database.
To run the site, you need to first import the database to your localhost. You need to have installed MySql beforehand. First, start a live server, such as xampp or wamp.
Then, go to localhost/phpmyadmin. Create new database, named "watches", and after you created it, import the given sql file with the same name, from the respository 
to the created database. After that, open both directories backend_final & frontend_final within a terminal or command prompt, and start them with the command "npm start". 
The website should appear in your browser as http://localhost:3000/. In case, the terminal gives issues, try running first "npm install", and then "npm start".

