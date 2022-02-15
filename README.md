# [STADVDB] MCO2 Distributed Database Management System

This is a group project for STADVDB where we needed to simulate a distributed database management system using cloud services. For our project, we decided to use the Amazon Web Services (AWS) RDS to mimic databases that are in different locations. The web application is used as interface to interact with the three nodes. Node 1 contains all movies from the IMDB repository, node 2 contains movies that were released before the year 1980 and node 3 contains movies that were released from the 1980s onward. This project features concurrency control and consistency across the three nodes and a global failure recovery system.

> Note that the AWS RDS databases are only using the free tier (limited hours per month) and may result to be closed.

Live link:

To run locally, execute the following:
```
npm i
npm start
```

### Group Members:
- Choi, Pete Fredrich
- Go, Wilfred
- Lizan, Rayden
- Sy, James Matthew

