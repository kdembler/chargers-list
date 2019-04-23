# Chargers List

React + Flask app leveraging OpenChargeMap API to show you charging locations.

## Getting it
Clone the repo:
```
$ git clone https://github.com/kdembler/chargers-list
```

## Running it
### The easy way
The most straightforward approach is to use Docker, simply run:
```
$ docker-compose up
```
Give it a sec to build and you the app will be available at http://localhost

### The harder way
You can also run both the frontend and backend yourself locally in development.

Start the backend:
```
$ cd backend
# make sure that you have all the dependencies in your Python environment, if not:
$ pip3 install -r requirements.txt
$ ./main.py
```

And start the frontend app:
```
$ cd frontend
$ yarn # or npm install
$ yarn start # or npm start
```

And it's done!

## Acknowledgements
Bolt favicon by [Smashicons](https://flaticon.com/authors/smashicons) from [flaticon.com](https://www.flaticon.com)
