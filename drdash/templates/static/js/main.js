
$( document ).ready(function() {
  $(".episodes-list").niceScroll(
    {cursorwidth:8,
    cursoropacitymin:0.4,
    cursorcolor:'#6e8cb6',
    cursorborder:'none',
    cursorborderradius:4,
    autohidemode:'leave'});

  $(".episodes-list-watch").niceScroll(
    {cursorwidth:8,
    cursoropacitymin:0.4,
    cursorcolor:'#6e8cb6',
    cursorborder:'none',
    cursorborderradius:4,
    autohidemode:'leave'});

    $(".show-disqus-comments").click(function() {
      $.ajax({
        type: "GET",
        url: "https://arab-movies.disqus.com/embed.js",
        dataType: "script",
        cache: !0
      }), $(this).remove()
  });
  
  
  function footerAlign() {
    $('footer').css('display', 'block');
    $('footer').css('height', 'auto');
    var footerHeight = $('footer').outerHeight();
    $('body').css('padding-bottom', footerHeight);
    $('footer').css('height', footerHeight);
  }
  $(document).ready(function(){
    footerAlign();
  });
  $( window ).resize(function() {
    footerAlign();
  });
  
  
  var should_be_selected = 'optionselect';
      $('#scoreselect').find('.' + should_be_selected).attr('selected', 'selected');
  
  var should_be_selected = 'optionselect';
      $('#statusselect').find('.' + should_be_selected).attr('selected', 'selected');
});


