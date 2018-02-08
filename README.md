# Linear Regression Visualization with D3 and Flask
## What is this?
This is a very simple interactive visualization of linear regression. I made it to teach myself the basic web development skills needed for web-based data visualization.

## How to use
1. Clone this repo and navigate to its root folder.
2. If you're using Anaconda/Miniconda, set up the environment with `conda env create -f environment.yml`, then use `source activate lrv` to activate it.<br />If you don't have `conda`, just make sure you have the packages listed in `environment.yml`.
3. Run `python server.py`.
4. Go to your web browser and navigate to [localhost:5000](http://localhost:5000).
5. The visualization is pretty self-explanatory. Have fun!
6. To clean up, run `source deactivate` to stop using the environment. Shut down the server process as well.
7. If you really want to clean up, delete the `lrv` environment from your system using `conda remove --name lrv --all`.

## Structure of the code
In the root folder, `server.py` serves up `templates/index.html` and manages the connection to a SQLite database, which is found in `data/points.db`. The main code for the visualization is found in `static/js/script.js`, which works primarily with the SVG element and specifies the behavior of the button. `static/css/style.css` provides styles that are not data-dependent. `config.py` simply lists some configuration options which are
imported into `server.py`.

## Guide for the confused
### What is D3?
Web pages fundamentally are made from files written in three distinct computer languages:
- HyperText Markup Language (HTML) files lay out the **structure** of a page
- Cascading Style Sheets (CSS) files specify how HTML components should be **presented**
- JavaScript (JS) describes the **behavior** of the page

Web browsers understand these languages and how they interact. When you navigate to a URL, your browser requests these files, together with other supporting material (images, videos, etc.) from a server somewhere. When you run `server.py` in step 3 above, that server is set up on your own computer; navigating to the localhost URL requests the files from that server. No internet required!

Of the three languages above, JavaScript is the only one which is really a proper "programming language". JavaScript can essentially be used to dynamically create HTML and CSS code &mdash; in response to user actions, for instance. This makes JavaScript a very powerful language for data visualization; the library [D3.js](https://d3js.org/) allows some aspects of the generated HTML/CSS to depend on provided datasets.

### What is Flask?
JavaScript can also be used to send and receive data from server-side processes which may interact with databases, run statistical routines, etc. This is mainly done via **HTTP requests**. Most D3 tutorials online ignore this aspect of JS, which is a shame because many of the people interested in data visualization are data scientists (like me!) and are otherwise not connected to the world of web development. Even worse, most of these data scientists are already working in Python, which is a a solid backend develpment language.

A **web framework** is a server-side program that manages HTTP requests and their responses. Python has two well-known web frameworks: Django for heavyweight applications and [Flask](http://flask.pocoo.org/) (used here) for smaller ones.

### SQLite and SQLAlchemy
One of the advantages of using a web framework is that it allows for the use of a database. Here I just use SQLite, which stores the entire database in a single file (`data/points.db`). Everything needed to work with SQLite databases comes with Python as part of the standard library.

Rather than using SQLite directly, I insert another layer in between the database and the web framework called [Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.3/). This provides [SQLAlchemy's](https://www.sqlalchemy.org/) "object-relational mapping" (ORM) in a Flask-friendly format. Essentially, rather than actually using SQL to talk to the database, the ORM allows me to interact with it purely through the use of Python classes and objects. In `server.py` you can see that I have an oddly SQL-ish Python class called `Point` with things like a "primary key" and "non-nullable fields", but nowhere in my code will you find actual SQL.

Another benefit of this approach is that I can easily switch to a MySQL or PostgreSQL database simply by changing `SQLALCHEMY_DATABASE_URI` in `config.py` to point to one of those rather than my SQLite file.

### Why not use Bokeh/Shiny/Tableau?
These tools are convenient, but are more limited than the approach taken here, almost by definition. For simple visualizations and dashboards, they're sufficient and perhaps even preferable to D3, but they can only take you so far.
