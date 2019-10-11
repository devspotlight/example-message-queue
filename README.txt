An easy and quick-to-deploy message queue example using Heroku, Redis, and RSMQ. 

This code is from the article "Scale Your Apps with an Easy Message Queue on Redis".


To deploy the message queue on Heroku using the Heroku CLI:

  $ git clone https://github.com/CapnMB/example-message-queue.git
  $ cd example-message-queue
  $ heroku create
  $ heroku addons:create heroku-redis
  $ git push heroku master
  $ heroku ps:scale worker=1
  $ heroku open
