(function (global){

var Utils = function() {
	var self = {};

 	self.markdown = function(text) {
 		var html = marked(text);
 		return html;
 	}
 	
 	self.getPreviewsHTML = function(text) {
		var previews = [];
		var previewHTML = '';
		//Search for all links in the text
		var searchPattern = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
		var videoRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/i;
		matches = text.match(searchPattern);
		if(matches) {
			matches = $.unique(matches);
			matches.forEach( function(entry) {
				//var expression = new RegExp(XRegExp.escape(entry), "g");
				var preview = '';
				var video_id = '';
				if (entry.match(/\.(gif|png|jpg|jpeg)$/)) {
					// Turn images into previews
					preview = '<a href="' + entry + '" target="_blank"><img class="image_preview" src="' + entry + '" alt="Image preview"/></a>';
					previews.push(preview);
				} else if (id_matchs = entry.match( videoRegExp )) {
					if (id_matchs[2].length==11){
 					   video_id = id_matchs[2];
					}
					preview = '<div class="flex-video"><iframe id="ytplayer" type="text/html" src="http://www.youtube.com/embed/' + video_id + '?autoplay=0&origin=http://osomtalk.com" frameborder="0"/></div>';

					//Turn Youtubes into Embeddeds
					previews.push(preview);
				}
			});
					
			previewHTML += '<div class="preview_container"><button type="button" class="pull-right toggle_previews btn btn-small" onclick="tooglePreview(this);"><i class="icon-circle-arrow-up"></i> Hide Previews</button><br/><br/><div class="previews">';
			previews.forEach( function(entry) {
				previewHTML += entry + " ";
			});
			previewHTML += '</div></div>';
		}
		return previewHTML;
	}

	/** Taken From http://stackoverflow.com/a/5885493/7946 **/
	self.makeId = function (length, current){
		current = current ? current : '';
		return length ? self.makeId( --length , "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt( Math.floor( Math.random() * 60 ) ) + current ) : current;
	}

	return self;
};

global.utils = new Utils();
}(typeof window  === 'undefined' ? exports : window));