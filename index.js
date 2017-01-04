var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME,
  multipleStatements: true
});


exports.myHandler = function(event, context, callback) {
    var queryTemplate = 'INSERT INTO `data` (`sn`, `site`, `location`, `mod`, `sid`, `type`, `cid`, `name`, `unit`, `value`, `raw`, `ts`) ' +
                'VALUES (?,?,?,?,?,?,?,?,?,?,?,?);';
    
    var query = '';
    var values = [];
    var packet = JSON.parse(event.body);
    
    console.log(packet, typeof packet);
    // Construct the query
    packet.data.forEach(function(record){
        query += queryTemplate;
        values.push(
            packet.sn,
            packet.site,
            packet.location,
            packet.mod,
            packet.sid,
            packet.type,
            packet.cid,
            packet.name,
            packet.unit,
            record.value,
            record.raw,
            record.ts
        )
    });
    

    // Put it into the database
    connection.query(query, values, function(err, rows) {
        if(err){
            console.log(err);
            return context.fail(err);
        }
    
        return context.succeed({
          statusCode: 200,
          body: ""
        })
    });
}
