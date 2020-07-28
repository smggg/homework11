const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        const notesArr = JSON.parse(data);
        res.json(notesArr)
    });
})



app.post("/api/notes", function (req, res) {
    const newnote = req.body;

    fs.readFile("./db/db.json","utf8",function(error,data){
        const noteList = JSON.parse(data)
        if(noteList.length === 0){
            newnote.id =1;
        }else{
            const lastnote = noteList[noteList.length-1]
            newnote.id = lastnote.id +1
        }

        noteList.push(newnote);

        fs.writeFile("./db/db.json",JSON.stringify(noteList),function(error,data){
            if (error) {
                return res.status(400)
            }
            res.json(newnote);
        })
    })
});


// ----delete-----
app.delete("/api/notes/:id", function(req, res) {
    const deleteID = parseInt(req.params.id)
    // const id = req.params.id;
    fs.readFile("./db/db.json", "utf8", function (error, data) {
        const noteList = JSON.parse(data)
        for(let i = 0; i < noteList.length; i++) {
            if(noteList[i].id === deleteID) {
                noteList.splice(i,1); 
            }
        }

        fs.writeFile("./db/db.json", JSON.stringify(noteList), function(error, data) {
            res.json(req.params.id); 
        })
    })
});



app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});