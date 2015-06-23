var app = {};
app.init = function(){

}
app.fetch = function() {$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  // data: JSON.stringify(message),
  // contentType: 'application/json',
  success: function (data) {
    _.each(data['results'], function (post){
      var text = bleach.sanitize(post.text);
      var user = bleach.sanitize(post.username);
      if(!(user === 'undefined' || text === 'undefined')) {
        $('body').append("<div id = chats>"+user+":"+text+"</div>")
      }
    })
    console.log('chatterbox: Message recieved');
  },
  error: function (data) {
    console.error('chatterbox: Failed to recieve');
  }
})};

app.addMessage = function(text) {
  var message = {}

  //Prompt - grab user input
  message.username = window.location.search.slice(10);
  message.text = text
  message.roomname = 'default'

  return message;
}
app.clearMessages = function() {
  $('#chats').remove();
}

app.send = function(message) {

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}


$(document).ready(function(){
  //GET Messages from parse.com
  app.fetch()

  $('.refresh').on('click', function() {
    app.clearMessages()
    app.fetch();
  });

  $('.input').focus().select();

  $('.submit').on('click', function() {
    sendMessage(createMessage($('.input').val()));
  });
})
