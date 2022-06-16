
var monitoring_selector = 'a[title=".colony.yaml"]';



async function waitForActiveSandbox(sandbox_id) {
  try {
    browser.storage.sync.get(function(storageData){
      var waitUrl = "https://2091a0234388.ngrok.io/colonize/sandbox_status/";
      //console.log(waitUrl);

      body = {
                "sandbox_id": sandbox_id,
                "colony_account": storageData.colony_account,
                "colony_user": storageData.colony_user,
                "colony_pass": storageData.colony_pass,
                "colony_space": storageData.colony_space
            }
      
      $.ajax({
        url: waitUrl,
        data: JSON.stringify(body),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          //console.log(data);
          outputDiv = $('#colonyOutput');
          if (data.sandbox_status == 'Active')
          {
            outputDiv.append('<br/>');          
            outputDiv.append('<span>Browse to the target <a href="'+ data.target +'" target="_blank">website</a></span>');
          } 
          else if (data.sandbox_status == 'Ended')
          {
            outputDiv.append('<br/>');
            outputDiv.append('<span>The sandbox was ended.</span>');
          }
          else if (data.sandbox_status == 'Launching') {
            outputDiv.append('.');
            setTimeout(() => {
              waitForActiveSandbox(sandbox_id);
            }, 10000);            
          }
        }    
      }).done(function() {
        //btnAdded.disabled = false;
        console.log('done');
      }).fail(function(jqXHR, textStatus, error) {
        console.log('failed');
        console.log(error);
        setTimeout(() => {
          waitForActiveSandbox(sandbox_id);
        }, 10000);
        //btnAdded.disabled = false;
      });
    });
  } catch (err) {
    console.log(err.message);
  }
}

function colonize(thisRepo, duration) {
  try {
    browser.storage.sync.get(function(storageData){
        //console.log(storageData);
        var colonizeUrl = "https://2091a0234388.ngrok.io/colonize/";
        //console.log(colonizeUrl);
        var btnAdded = document.getElementById('colonizeBtn');
        // console.log(btnAdded);
        // btnAdded.disabled = true;
        var outputDiv = document.getElementById('colonyOutput');
        if (!outputDiv)
        {
          $('.file-navigation').after('<div class="Box mb-3 Box-body bg-gray-light" style="background-color:#212 !important" id="colonyOutput"></div>');
          var outputDiv = $('#colonyOutput');
          outputDiv.append('<span>Starting a new sandbox for you in CloudShell Colony...<span>');      
        }

        body = {
              "repo_path": thisRepo,
              "colony_account": storageData.colony_account,
              "colony_user": storageData.colony_user,
              "colony_pass": storageData.colony_pass,
              "colony_space": storageData.colony_space,
              "duration": duration
          }
        // console.log(body);

        $.ajax({
          url: colonizeUrl,
          data: JSON.stringify(body),
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            //console.log(data);
            outputDiv = $('#colonyOutput');
            outputDiv.append('<br/>');
            outputDiv.append('<span>A Colony Sandbox was created and is available <a href="'+ data.sandbox_url +'" target="_blank">here</a></span>');
            outputDiv.append('<br/>');
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            outputDiv.append('<span>Waiting for the public address, this might take a few minutes...</span>');
            waitForActiveSandbox(data.sandbox_id);
          }    
        }).done(function() {
          //btnAdded.disabled = false;
          console.log('done');
        }).fail(function(jqXHR, textStatus, error) {
          console.log('failed');
          console.log(error);
          //btnAdded.disabled = false;
        });
    });
    
    
    
  } catch (err) {
    console.log(err.message);
  }
}

function addColonizeLink() {
  console.log(".colony.yaml found");
  //var links=0;
  var btnAdded = document.getElementById('colonizeBtn');
  if (btnAdded)
    return;

  var nav = $('.file-navigation');
  var thisRepo = window.location.pathname.substring(1).replace('/', '%2F');
  var colonyBtn = '<a id="colonizeBtn" class="btn ml-2 d-none d-md-block" data-pjax="true" style="background-color:#6f42c1;">Colonize</a>';
  nav.append(colonyBtn);

  html = '<h2 class="swal2-title" style="display:block ruby;font-size:26px;text-align:center">Deploy with CloudShell Colony</h2><br/><br/>';
  html+= '<span class="has-text-left" style="display:flex">Please provide the following information:</span><br/><br/>';
  html+= '<div class="columns" style="display:flex;justify-content:space-between">';
  html+= '<div class="column has-text-left is-two-thirds">';
  html+= 'Duration (minutes): ';
  html+= '</div>';
  html+= '<div class="column has-text-right">';
  html+= '<input type="text" id="sandbox_duration" style="width:100px !important;" onfocus="this.select()" value="25"></input><br/><br/>';
  html+= '</div>';
  html+= '</div>';
                    
  $('#colonizeBtn').on('click', function(e) {
      const { value: text } = Swal.fire({
        html: html,
        // title: "Deploy with CloudShell Colony",
        showCancelButton: true,
        showClass: { popup: 'animated fadeIn faster' },
        hideClass: { popup: 'animated fadeOut faster' },
        preConfirm: () => {
            return [
              document.getElementById('sandbox_duration').value,              
            ]
        },
        confirmButtonText: "Start",
        confirmButtonColor: '#6f42c1'        
      }).then(function(response) {
        if (response.isConfirmed) {
            if (response.value) {
              //console.log(response.value[0]);
              colonize(thisRepo, response.value[0]);
            }
        }
      });
  });

}

function waitForEl(selector, callback){
    var poller1 = setInterval(function(){
        $jObject = $(selector);
        if($jObject.length < 1){
            return;
        }
        clearInterval(poller1);
        callback($jObject)
    },500);
}

waitForEl(monitoring_selector, function() {
  // work the magic
  addColonizeLink();
  // setTimeout(watchPageForChange(),1000);
});


browser.runtime.onMessage.addListener(request => {

  if (request.type === 'getDoc') {
      waitForEl(monitoring_selector, function() {
        addColonizeLink();
        // setTimeout(watchPageForChange(),1000);
      });

      response(document);
    }

    return true;
});
