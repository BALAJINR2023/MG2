//Find all the topics and tasks which are thought in the month of October.
db.tasks.aggregate([
    {
      $lookup: {
        from: "topics",
        localField: "taskid",
        foreignField: "topicid",
        as: "result"
      }
    },
    {
      $match: {
        "due_date": {
          "$gte": ISODate("2020-10-01T00:00:00.000Z"),
          "$lte": ISODate("2020-10-31T23:59:59.999Z")
        }
      }
    },
    {
      $unwind: { path: "$result" }
    },
    {
      $project: {
        _id: 0,
        taskid: 1,
        task: 1,
        due_date: 1,
        "result.topicid": 1,
        "result.topic": 1,
        "result.topic_date": 1
      }
    }
  ]);
//Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020.
db.companydrives.find({
    drive_date: {
      $gte: ISODate("2020-10-15T00:00:00.000Z"),
      $lte: ISODate("2020-10-31T23:59:59.999Z")
    }
  })
//Find all the company drives and students who are appeared for the placement.
db.users.aggregate([
    {
      $lookup: {
        from: "companydrives",
        localField: "userid",
        foreignField: "userid",
        as: "result"
      }
    },
    {
      $unwind: {
        path: "$result"
      }
    },
    {
    $match: {Placement:true }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        "result.company": 1,
              }
    }
  ]);
//Find the number of problems solved by the user in codekata.
db.users.aggregate([
    {
      $lookup: {
        from: "codekata",
        localField: "userid",
        foreignField: "userid",
        as: "result"
      }
    },
    {
      $unwind: {
        path: "$result"
      }
    },
    {
      $project: {
        _id: 0,
        name: 1,
        "result.problems": 1,
              }
    }
  ]);
//Find all the mentors with who has the mentee's count more than 15.
db.mentors.aggregate([
    {$match: {
        mentee_count:{$gte:15}
        }
      }
])
//Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020.
db.users.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "user_id",   
        foreignField: "task_id", 
        as: "result"
      }
    },
    {
      $unwind: { path: "$result" }
    },
    {
      $match: {
        "result.is_submitted": true 
      }
    },
    {
      $count: "submitted_tasks_count" 
    }
]);
