
var lang_rtl = false;
var get_notifications_text = 'Get Notifications';
var stop_notifications_text = 'Stop Notifications';
var monitoring_selector = 'div[role="main"]';


function detectLang() {
  var testid = $('#pinnedNav').data('testid');
  if (testid && testid.includes('קיצורי'))
  {
    lang_rtl = true;
    get_notifications_text = 'קבל התראות';
    stop_notifications_text = 'עצור התראות';
  }
}

function addFollow(followid, messageid)
{
  var link_text = get_notifications_text;
  $('#'+followid+'_f').after('<a id="'+followid+'" aria-pressed="false" href="#" role="button" tabindex="2" data-testid="fbf-ufi-followlink" rel="async-post" ajaxify="/ajax/litestand/follow_post?message_id='+messageid+'&amp;follow=1">'+link_text+'</a>');
  $('#'+followid+'_f').remove();

  $('#'+followid).on('click', function(e) {
      addUnfollow(followid, messageid);
  });
}
function addUnfollow(followid, messageid)
{
  var link_text = stop_notifications_text;
  $('#'+followid).after('<a id="'+followid+'_f" aria-pressed="false" href="#" role="button" tabindex="2" data-testid="fbf-ufi-followlink" rel="async-post" ajaxify="/ajax/litestand/follow_post?message_id='+messageid+'&amp;follow=0">'+link_text+'</a>');
  $('#'+followid).remove();

  $('#'+followid+'_f').on('click', function(e) {
      addFollow(followid, messageid);
  });

  return true;
}

function addFollowLinkToNode(node)
{
  var form=node.parents('form')[0];
  //console.log(form);
  if (form && form.length>0)
  {
    var id = "#" + form.id;
    var messageid = $(id).find('input[name="ft_ent_identifier"]')[0].value.trim();
    var followlink = $(id).find('a[data-testid="fbf-ufi-followlink"]');
    if (followlink && followlink.length==0)
    {
      var followid = 'flink-' + form.id;
      var link_text = get_notifications_text;
      var icon_left_pos = (lang_rtl) ? '':'-';
      node.after('<i style="background-image:url(/rsrc.php/v3/yX/r/1li7Ildh1mE.png);background-repeat:no-repeat;background-size:auto;background-position:-17px -1732px;width:16px;height:16px;left:'+icon_left_pos+'6px;top:9px;position:relative;" /><a id="'+followid+'" aria-pressed="false" href="#" role="button" tabindex="2" data-testid="fbf-ufi-followlink" rel="async-post" ajaxify="/ajax/litestand/follow_post?message_id='+messageid+'&amp;follow=1">'+link_text+'</a>');
      $('#'+followid).on('click', function(e) {
          addUnfollow(followid, messageid);
      });
    }
  }
}

function addUnFollowLinkToNode(node)
{
  var form=node.parents('form')[0];
  //console.log(form);
  if (form && form.length>0)
  {
    var id = "#" + form.id;
    var messageid = $(id).find('input[name="ft_ent_identifier"]')[0].value.trim();
    var followlink = $(id).find('a[data-testid="fbf-ufi-followlink"]');
    if (followlink && followlink.length==0)
    {
      var followid = 'flink-' + form.id;
      var link_text = stop_notifications_text;
      var icon_left_pos = (lang_rtl) ? '':'-';
      node.after('<i style="background-image:url(/rsrc.php/v3/yX/r/1li7Ildh1mE.png);background-repeat:no-repeat;background-size:auto;background-position:-17px -1732px;width:16px;height:16px;left:'+icon_left_pos+'6px;top:9px;position:relative;" /><a id="'+followid+'_f" aria-pressed="false" href="#" role="button" tabindex="2" data-testid="fbf-ufi-followlink" rel="async-post" ajaxify="/ajax/litestand/follow_post?message_id='+messageid+'&amp;follow=0">'+link_text+'</a>');
      $('#'+followid).on('click', function(e) {
          addFollow(followid, messageid);
      });
    }
  }
}

function addFollowLinks() {

  //var links=0;
  $('a[data-testid="fb-ufi-likelink"]').each( function( index, element ){
      //links+=1;
      addFollowLinkToNode($(this));
  });
  $('a[data-testid="fb-ufi-unlikelink"]').each( function( index, element ){
      //links+=1;
      addUnFollowLinkToNode($(this));
  });
  //console.log('links added: ' + links.toString());

}

function waitForEl(selector, callback){
    var poller1 = setInterval(function(){
        $jObject = jQuery(selector);
        if($jObject.length < 1){
            return;
        }
        clearInterval(poller1);
        callback($jObject)
    },500);
}

waitForEl(monitoring_selector, function() {
  // work the magic
  detectLang();
  addFollowLinks();
  setTimeout(watchPageForChange(),1000);
});

function watchPageForChange(){
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var observer = new MutationObserver(function(mutations, observer) {
	    // fired when a mutation occurs
	    mutations.forEach(function(mutation) {
	        if(mutation.type == "childList"){
            try {
				      loaded = mutation.addedNodes[0].childNodes[0].childNodes[0].childNodes;
				      if(loaded.length > 0){
				    	  addFollowLinks();
				      }
				    }
				    catch(err) {
              //console.log(err);
				    }
			    }
	    });
	});

	observer.observe($(monitoring_selector)[0], {
	  subtree: true,
	  childList: true
	});
}


function addFollowLinkToSubNode(node_id) {
  var flinks=0;
  var ulinks=0;
  node_id = node_id.replace(/:/g,'\\:');
  //console.log('node id:' + node_id);
  $('#'+node_id).find('a[data-testid="fb-ufi-likelink"]').each( function( index, element ){
      flinks+=1;
      addFollowLinkToNode($(this));
  });
  $('#'+node_id).find('a[data-testid="fb-ufi-unlikelink"]').each( function( index, element ){
      ulinks+=1;
      addUnFollowLinkToNode($(this));
  });
  //console.log('follow links added: ' + flinks.toString());
  //console.log('unfollow links added: ' + ulinks.toString());
}

chrome.extension.onMessage.addListener(function(request, sender, response) {

  if (request.type === 'getDoc') {

    waitForEl(monitoring_selector, function() {
      detectLang();
      addFollowLinks();
      setTimeout(watchPageForChange(),1000);
    });

    response(document);
  }

  return true;
});
