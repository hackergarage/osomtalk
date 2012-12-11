(function (global){

	var Room = function(config) {
		config = config || {};
		var self = {};

		self.id			= config.id;
		self.name		= config.name || '';
		self.users  	= config.users || [];
		self.messages 	= config.messages || [];

		self.getRoom = function () {
			return {id:self.id, name:self.name, messages:self.messages, users:self.users};
		};

		self.getMessages = function () {
			return self.messages;
		};

		self.setMessages = function(messages) {
			self.messages = messages;
		}

		self.getUsers = function () {
			return self.users;
		};

		self.addUser = function(user) {
			self.users.push(user);
		};

		self.addMessage = function(data) {
			var message = {
				id: data.id,
				time: data.time,
				text: data.text,
				user: data.user,
				identifier: data.identifier
			}

			if ( typeof window  !== 'undefined' ) {
				self.renderMessage(message);
				if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
					var text = (message.text >30)? message.text.substring(0,20) + '...': message.text;
					var notification = window.webkitNotifications.createNotification(
						'/img/favicon.png', self.name, message.user.username +": " + text);
					notification.ondisplay = function() {
						setTimeout(function() {
							notification.cancel();
						}, 5000);
					};
					notification.show();
				}			
			} else {
				//If you ever need to have the messages as data on the client side, take this line out of the if
				self.messages.push(message);
				if ( self.messages.length > 100 ) {
					//Maximum of 100 messages in memory for each chat on the server chat
					console.log('deleting extra message', self.messages.shift());
				}
			}
		};
	
		self.renderMessage = function (message) {
			var previewsHTML = utils.getPreviewsHTML(message.text, message.id);
			var escapedName = message.user.username.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			var date = new Date(message.time * 1000);
			var date = utils.getLocaleShortDateString(date) + " " + date.toLocaleTimeString();
			
			if(message.user.type=='TWITTER') {
				$('#messages').prepend('<div class="message" id="'+message.id+'"><span class="time">' + date + '</span>: <span class="user">' + escapedName + '</span> (<a class="muted" target="_BLANK" href="http://twitter.com/'+message.user.username+'">@'+message.user.username+'</a>)<br/>' + utils.markdown(message.text) + previewsHTML+'</div><hr/>');	
			} else {
				$('#messages').prepend('<div class="message" id="'+message.id+'"><span class="time">' + date + '</span>: <span class="user">' + escapedName + '</span> (<span class="muted">Anonymous</span>) <br/>' + utils.markdown(message.text) + previewsHTML+'</div><hr/>');
			}
			
		}
		
		/** renders the chat **/
		self.renderRoom = function() {
			/** Render Messages **/
			for(var i = 0; i < self.messages.length; i++) {
				self.renderMessage(self.messages[i]);
			}
		};
		
		/** Connections with web services **/
		/** Gets full room data **/
		self.getRoomData = function(callback){
			$.ajax({
				url: '/rooms/get/'+ self.id,
				success: function(data) {
					self.name = data.name;
					self.users = data.users;
					self.messages = data.messages;
					callback();
				}
			});
		};

		self.subscribe = function(client) {
			client.subscribe('/server_messages_'+ self.id, function(message) {
				self.addMessage(message);
			});
		}
		return self;
	};

	global.Room = Room;
}(typeof window  === 'undefined' ? exports : window));