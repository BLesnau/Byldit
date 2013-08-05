exports.register = function ( api ) {
   api.post( "/", createTag );
   api.post( "/:tagId/star", starTag );

   api.get( "/", getTagsInArea );
   api.get( "/:tagId/star", getStarInfo );

   api.delete( "/:tagId/star", deleteStar );
}

function createTag( request, response ) {
   var body = request.body;
   var user = request.user;
   var mssql = request.service.mssql;

   var queryString = "INSERT INTO ByldTag (UserId, Location, Title, Description) OUTPUT INSERTED.ID AS 'newId' VALUES (?, geography::STPointFromText('POINT(' + ? + ' ' + ? + ')', 4326), ?, ?)";
   mssql.query( queryString, [user.userId, body.longitude.toString(), body.latitude.toString(), body.title, body.description], {
      success: function ( results ) {
         response.send( statusCodes.OK, { tagId: results[0].newId } );
      },
      error: function () {
         response.send( statusCodes.INTERNAL_SERVER_ERROR );
      }
   } );
}

function getTagsInArea( request, response ) {
   var query = request.query;
   var mssql = request.service.mssql;

   var queryString = "SELECT id, UserId, Title, Description, Location.Lat Latitude, Location.Long Longitude FROM ByldTag WHERE Location.STIntersects(geography::STPointFromText('POINT(' + ? + ' ' + ? + ')', 4326).STBuffer(?))=1"
   mssql.query( queryString, [query.longitude, query.latitude, query.viewableMeters],
       {
          success: function ( results ) {
             response.send( statusCodes.OK, results );
          },
          error: function ( err ) {
             console.error( "Error retrieving pins:", err );
             response.send( statusCodes.NOT_FOUND );
          }
       } );
}

function starTag( request, response ) {
   var user = request.user;
   var params = request.params;
   var starTable = request.service.tables.getTable( "Star" );

   starTable.insert( { UserId: user.userId, TagId: params.tagId }, {
      success: function () {
         response.send( statusCodes.OK );
      },
      error: function () {
         response.send( statusCodes.INTERNAL_SERVER_ERROR );
      }
   } );
}

function getStarInfo( request, response ) {
   var user = request.user;
   var params = request.params;
   var starTable = request.service.tables.getTable( "Star" );

   starTable.where( { tagId: params.tagId } ).read( {
      success: function ( results ) {
         var starCount = results.length;
         var starredByUser = false;
         for ( var i in results ) {
            if ( results[i].UserId == user.userId ) {
               starredByUser = true;
            }
         }

         response.send( statusCodes.OK, { starCount: starCount, starredByUser: starredByUser } );
      },
      error: function () {
         response.send( statusCodes.INTERNAL_SERVER_ERROR );
      }
   } );
}

function deleteStar( request, response ) {
   var user = request.user;
   var params = request.params;
   var starTable = request.service.tables.getTable( "Star" );

   starTable.where( { userId: user.userId, tagId: params.tagId } ).read( {
      success: function ( results ) {
         starTable.del( results[0], {
            success: function ( results ) {
               response.send( statusCodes.OK );
            },
            error: function () {
               response.send( statusCodes.INTERNAL_SERVER_ERROR );
            }
         } );
      },
      error: function () {
         response.send( statusCodes.INTERNAL_SERVER_ERROR );
      }
   } );
}