/* VARIABLES */
var socket = io.connect();

var sessionId;
//get current session
var currentFolder = app.folder;
//get current project
var currentProject = app.project;
var imageData = null;




/* fonction accessible depuis l'extérieur :
    - listMediasOfOneType


*/

function listMediasOfOneType( mediasData) {
  var $allMedias = $();
  var lastMedias = mediasData;
  $.each( lastMedias, function( pathToTypeMediaFolder, mediaJsonNames) {
    console.log( mediaJsonNames);

    // récupérer toutes les infos des JSON
    var getAllJsonNames = Object.getOwnPropertyNames( mediaJsonNames);
    var pathMediaFolder = pathToTypeMediaFolder;

    $.each( getAllJsonNames, function( key, metaJsonName) {

      var thisMediaJsonValues = mediaJsonNames[metaJsonName];
      var mediaDatas = thisMediaJsonValues;

      // penser au cas de figure ou deux files sont trouvés (vidéo)

      // penser au cas de figure ou un texte est trouvé
      var newMedia = listOneMedia( pathMediaFolder, metaJsonName, mediaDatas);
      $allMedias = $allMedias.add( newMedia);
    });
  });

  return $allMedias;
}

function listOneMedia( pathMediaFolder, metaJsonName, mediaDatas) {

  var $currentMedia = '';
  var mediaFilenames = mediaDatas.files;

  if( pathMediaFolder === dodoc.projectPhotosFoldername)
    $currentMedia = showImage( pathMediaFolder, metaJsonName, mediaFilenames);

  if( pathMediaFolder === dodoc.projectAnimationsFoldername)
    $currentMedia = showAnimation( pathMediaFolder, metaJsonName, mediaFilenames);

  if( pathMediaFolder === dodoc.projectVideosFoldername)
    $currentMedia = showVideo( pathMediaFolder, metaJsonName, mediaFilenames);

  if( pathMediaFolder === dodoc.projectAudiosFoldername)
    $currentMedia = showAudio( pathMediaFolder, metaJsonName, mediaFilenames);

  if( pathMediaFolder === dodoc.projectTextsFoldername)
    $currentMedia = showText( pathMediaFolder, metaJsonName, mediaFilenames);

  $currentMedia
    .attr( 'data-metaJsonName', metaJsonName)
    .attr( 'data-mediatype', pathMediaFolder)
  	.attr( 'data-title', mediaDatas.title)
  	.attr( 'data-legende', mediaDatas.informations)
    ;

  if( mediaDatas.title === undefined && mediaDatas.informations === undefined) {
    $currentMedia.find('.mediaData').remove();
  }


  if( mediaDatas.fav === "true") {
    $currentMedia.addClass('is--highlight');
  }

  return $currentMedia;
}

function makeFullMediaPath( pathToMediaFolderAndMedia) {
  return '/' + currentFolder + '/' + currentProject + '/' + pathToMediaFolderAndMedia;
}

function showImage( pathMediaFolder, metaJsonName, mediaFilenames) {

  var pathToFile = makeFullMediaPath( pathMediaFolder + '/' + mediaFilenames[0]);

	var mediaItem = $(".js--templates .media_image").clone(false);
	mediaItem
    .find( 'img').attr('src', pathToFile)
    ;
	return mediaItem;
}

function showAnimation( pathMediaFolder, metaJsonName, mediaFilenames) {

  var thumbFilename;
  var videoFilename;
  $.each( mediaFilenames, function( key, mediaFilename) {
    if( mediaFilename.indexOf( "jpg") !== -1) {
      thumbFilename = mediaFilename;
    } else if ( mediaFilename.indexOf( "mp4") !== false ||  mediaFilename.indexOf( "webm") !== false) {
      videoFilename = mediaFilename;
    }
  });

  var pathToThumb = makeFullMediaPath( pathMediaFolder + '/' + thumbFilename);
  var pathToVideoFile = makeFullMediaPath( pathMediaFolder + '/' + videoFilename);

	var mediaItem = $(".js--templates .media_stopmotion").clone(false);
	mediaItem
    .find( 'video').attr( 'poster', pathToThumb).end()
    .find( 'source').attr( 'src', pathToVideoFile).end()
  ;

	return mediaItem;
}
function showVideo( pathMediaFolder, metaJsonName, mediaFilenames) {

  var thumbFilename;
  var videoFilename;

  $.each( mediaFilenames, function( key, mediaFilename) {
    if( mediaFilename.indexOf( "jpg") !== -1) {
      thumbFilename = mediaFilename;
    } else if ( mediaFilename.indexOf( "mp4") !== false ||  mediaFilename.indexOf( "webm") !== false) {
      videoFilename = mediaFilename;
    }
  });

  var pathToThumb = makeFullMediaPath( pathMediaFolder + '/' + thumbFilename);
  var pathToVideoFile = makeFullMediaPath( pathMediaFolder + '/' + videoFilename);

	var mediaItem = $(".js--templates .media_video").clone(false);
	mediaItem
    .find( 'video').attr( 'poster', pathToThumb).end()
    .find( 'source').attr( 'src', pathToVideoFile).end()
  ;

	return mediaItem;
}

function showAudio( pathMediaFolder, metaJsonName, mediaFilenames) {
  var pathToFile = makeFullMediaPath( pathMediaFolder + '/' + mediaFilenames[0]);

	var mediaItem = $(".js--templates .media_audio").clone(false);
	mediaItem
    .find( 'source').attr( 'src', pathToFile)
    ;
	return mediaItem;
}