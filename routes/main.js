module.exports = function(app, obj){    
    app.get("/demo", function(req, res){
        res.render("master", {
            domain:obj.domain
        });
    });
}