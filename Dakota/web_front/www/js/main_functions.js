
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Global variables
// --- Div that we hide-behind and pop-up-on-top of the main web page, eg. to say "please wait while container is being launched"
var div_to_hide = ["waiting_div"];
// --- Action specification, when showing the waiting div
var action_specification = "";
// --- Action specification, when showing the waiting div
var code_containers = [];




// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Loading functions
window.onload = function()
{
  // --- This checks for the terminal log-file to give a live-update to the user
  setInterval(function(){get_terminal_output();}, 1000);

  // --- This is the main tab we open when launching the app
  document.getElementById("defaultOpen").click();

  // --- Hide all utility div's
  for (i = 0; i < div_to_hide.length; ++i)
  {
    document.getElementById(div_to_hide[i]).style.visibility="hidden";
    document.getElementById(div_to_hide[i]).style.zIndex=-1000;
    document.getElementById(div_to_hide[i]).style.height=0;
    document.getElementById(div_to_hide[i]).style.overflow="hidden";
  }

  // --- Sanity check for the registered images
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "php/image_registry.php?action=sanity_check&image=not_needed", false);
  xmlhttp.send();

  // --- Check if we have Code docker images available
  code_images = get_code_images();
  selector = document.getElementById("image_selector");
  for (i=0 ; i<code_images.length ; ++i)
  {
    new_image = document.createElement('option');
    new_image.setAttribute("value",code_images[i]);
    new_image.innerHTML = code_images[i];
    selector.appendChild(new_image);
  }

  // --- Make sure the drop-down is on the correct
  selected_image = getCookie('selected_image');
  if (selected_image != '')
  {
    // --- That's the simple cases
    if ( (selected_image == 'new_image') || (selected_image == 'select_image') )
    {
      image_select_change(selected_image);
    // --- Otherwise make sure the cokkie image still exists in the registry!s
    }else
    {
      found_image = 'false';
      for (i=0 ; i<code_images.length ; ++i)
      {
        if (code_images[i] == selected_image)
        {
          image_select_change(selected_image);
          found_image ='true';
          break;
        }
      }
      if (found_image == 'false')
      {
        image_select_change('select_image');
      }
    }
  }

  // --- Reset 0D input form if we reloaded page
  reset_0D_input();

}





// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Interactive waiting div : show/hide functions
function show_waiting_div()
{
  document.getElementById("waiting_div").style.position="absolute";
  document.getElementById("waiting_div").style.visibility="visible";
  document.getElementById("waiting_div").style.zIndex=3000;
  document.getElementById("waiting_div").style.marginLeft="30%";
  document.getElementById("waiting_div").style.width="40%";
  document.getElementById("waiting_div").style.top="20%";
  document.getElementById("waiting_div").style.height="60%";
  document.getElementById("waiting_gif").style.visibility="hidden";
  document.getElementById("action_wrapper_button").style.visibility="visible";
}
function hide_waiting_div()
{
  document.getElementById("waiting_div").style.visibility="hidden";
  document.getElementById("waiting_gif").style.visibility="hidden";
  document.getElementById("waiting_div").style.zIndex=-3000;
}




// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Open/Close Tabs for actions
function openTab(evt, cityName)
{
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}



// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Generic function that sends php requests server-side to execute command lines
// --- The function takes a linux command, and prints its output to the innerHTML of the div named by output_destination
function execute_command_async(command,output_destination)
{
  if (command.length == 0)
  {
    document.getElementById(output_destination).innerHTML = "";
    return;
  }else
  {
    // ===%%%=== is used as a replacement for spaces (which are not allowed in http request url...)
    command = command.replace(' ','===%%%===');
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        document.getElementById(output_destination).innerHTML = this.responseText;
      }
    };
    xmlhttp.open("GET", "php/server_side_functions.php?input=" + command, true);
    xmlhttp.send();
  }
}
function execute_command(command)
{
  if (command.length == 0)
  {
    return "";
  }else
  {
    // ===%%%=== is used as a replacement for spaces (which are not allowed in http request url...)
    command = command.replace(' ','===%%%===');
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "php/server_side_functions.php?input=" + command, false);
    xmlhttp.send();
    return xmlhttp.responseText;
  }
}
function execute_command_from_html(command, output_destination)
{
  if (command.length == 0)
  {
    document.getElementById(output_destination).innerHTML = "";
    return;
  }else
  {
    output = execute_command(command);
    output = output.replace('===%%%===','<br/>');
    document.getElementById(output_destination).innerHTML = output;
    return;
  }
}
function get_terminal_output()
{
  output = execute_command('head -n 1 /dakota_runs/terminal_output.txt ; tail /dakota_runs/terminal_output.txt');
  output = '<pre>'+output+'</pre>';
  document.getElementById('terminal_output').innerHTML = output;
}





// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Action wrapper which will be launched by the waiting-div action button and depends on the global variable "action_specification" to be set before call
function action_wrapper()
{
  // --- Hide the action button, in case of impatient users....
  document.getElementById("action_wrapper_button").style.visibility="hidden";
  // --- This should never happen...
  if (action_specification == "")
  {
    hide_waiting_div();
    return;
  }
  // --- Launch Dakota container
  if (action_specification == "launch_dakota")
  {
    document.getElementById("waiting_gif").style.visibility="visible";
    document.getElementById("waiting_message").innerHTML="<br/>Please wait while the dakota image is retrieved and launched.<br/>This may take a minute or so...<br/>";
    form = document.getElementById("dakota_form");
    form.submit();
    return;
  }
  // --- Launch Code container
  if (action_specification == "pull_code")
  { 
    Docker_image = document.getElementById("docker_image").value;
    document.getElementById("waiting_message").innerHTML="<br/>Please wait while your code image is retrieved and launched.<br/>This may take a moment depending on the image size...<br/>";
    document.getElementById("waiting_gif").style.visibility="visible";
    // --- Send form
    var formdata = new FormData();
    formdata.append("docker_image", Docker_image);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "php/pull_image.php",true);
    // --- We do this async because we want to catch the terminal output while the request runs...
    xmlhttp.onreadystatechange = function ()
    {
      if(this.readyState == 4 && this.status == 200)
      {
        // --- Add image to registry
        Docker_image = document.getElementById("docker_image").value;
        command = 'docker images --format="{{.Repository}}:{{.Tag}},{{.ID}}" | grep '+Docker_image;
        full_name= execute_command(command);
        full_name=full_name.replace('\n','');
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "php/image_registry.php?action=add_image&image="+full_name, false);
        xmlhttp.send();
        // --- Make sure this image is selected in drop-down after reload
        setCookie('selected_image',Docker_image,7);
        // --- Empty terminal output
        execute_command('echo "" > /dakota_runs/terminal_output.txt');
        location.reload();
        return;
      }
    };
    xmlhttp.send(formdata);
  }
  // --- Launch Code container
  if (action_specification == "main_run")
  { 
    document.getElementById("waiting_gif").style.visibility="visible";
    document.getElementById("waiting_message").innerHTML="<br/>Please wait while dakota launches containers for your jobs.<br/>This may take a moment depending on the number of runs...<br/>";
    form = document.getElementById("main_run_form");
    form.submit();
    return;  
  }
}






// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Launch Dakota container
function launch_dakota_container()
{
  // --- First check that there isn't a Dakota container already running
  dakota_id = execute_command("docker ps -aqf name=dakota_container --filter status=running");
  dakota_id = dakota_id.replace('\n','');
  if (dakota_id != "")
  {
    document.getElementById("dakota_comments").innerHTML="Dakota container already running!";
  }else
  // --- Launch a new container
  {
    show_waiting_div();
    document.getElementById("waiting_message").innerHTML="<br/>This will launch a Dakota container in the background.<br/>Are you sure you want to action this request?<br/>";
    action_specification = "launch_dakota";
  }
}






// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Code container functions
function pull_code_image()
{
  // --- First check that there isn't a Dakota container already running
  Docker_image   = document.getElementById("docker_image").value;
  // --- Check if image has already been built
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "php/image_registry.php?action=check_image&image="+Docker_image, false);
  xmlhttp.send();
  image_found = xmlhttp.responseText;
  if (image_found == "found")
  { 
    show_waiting_div();
    document.getElementById("waiting_message").innerHTML="<br/>WARNING: you already have a built image for:"
                                                        +"<br/>"+Docker_image+"<br/>"
                                                        +"<br/>This will over-write it with a new (updated?) image."
                                                        +"<br/>Are you sure you want to action this request?<br/>";
    action_specification = "pull_code";
  }else
  // --- Launch a new container
  {
    show_waiting_div();
    document.getElementById("waiting_message").innerHTML="<br/>This will pull a new Docker image of your code.<br/>Are you sure you want to action this request?<br/>";
    action_specification = "pull_code";
  }
}
function get_code_images()
{
  // --- Sanity check for the registered images
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "php/image_registry.php?action=get_all_images&image=not_needed", false);
  xmlhttp.send();
  all_images = xmlhttp.responseText;
  output = [];
  if (all_images != "")
  { 
    all_images = all_images.split("___%%%___");
    for (i=0; i < all_images.length; ++i)
    { 
      if (all_images[i] != "")
      {
        split_name_id = all_images[i].split("%%%___%%%"); 
        output.push(split_name_id[0]);
      }
    }
  }
  return output;
}
function get_code_image_id(image_name)
{
  // --- Sanity check for the registered images
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "php/image_registry.php?action=get_all_images&image=not_needed", false);
  xmlhttp.send();
  all_images = xmlhttp.responseText;
  if (all_images != "")
  {
    all_images = all_images.split("___%%%___");
    for (i=0; i < all_images.length; ++i)
    {
      if (all_images[i] != "")
      { 
        split_name_id = all_images[i].split("%%%___%%%");
        if (split_name_id[0] == image_name)
        {
          return split_name_id[1];
        }
      }
    }
  }
  return "";
}   
function image_select(selected_option)
{
  document.getElementById("new_image_form").style.visibility="hidden";
  document.getElementById("image_comments").innerHTML="";
  if (selected_option.value == "new_image")
  {
    document.getElementById("new_image_form").style.visibility="visible";
    setCookie('selected_image','new_image',7);
  }else
  {
    if (selected_option.value != "select_image")
    {
      document.getElementById("image_comments").innerHTML="Selected image:<br/>"+selected_option.value;
      setCookie('selected_image',selected_option.value,7);
    }else
    {
      setCookie('selected_image','select_image',7);
    }
  }
}
function image_select_change(optionValToSelect)
{
  selectElement = document.getElementById('image_selector');
  selectOptions = selectElement.options;
  for (var opt, j = 0; opt = selectOptions[j]; j++)
  {
    if (opt.value == optionValToSelect)
    {
      selectElement.selectedIndex = j;
      image_select(selectElement);
      break;
    }
  }
}









// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- 0D input functions
function add_0D_input()
{
  n_inputs = parseInt(document.getElementById("0D_n_inputs").value) + 1;
  if (n_inputs == 1)
  {
    table = document.getElementById("0D_input_table");
      new_input = document.createElement("tr");
        new_name  = document.createElement("th");
          new_name.innerHTML = "name";
        new_input.appendChild(new_name);
        new_value = document.createElement("th");
          new_value.innerHTML = "value";
        new_input.appendChild(new_value);
        new_error = document.createElement("th");
          new_error.innerHTML = "error";
        new_input.appendChild(new_error);
        new_nparts = document.createElement("th");
          new_nparts.innerHTML = "n_parts";
        new_input.appendChild(new_nparts);
    table.appendChild(new_input);
  }
  if (n_inputs > 3) 
  {
    document.getElementById("0D_comments").innerHTML="Sorry, only 3 0D inputs allowed at the moment";
    return;
  }
  document.getElementById("0D_n_inputs").value = n_inputs;
  table = document.getElementById("0D_input_table");
    new_input = document.createElement("tr");
      new_name  = document.createElement("th");
        new_name.innerHTML = "0D input #"+n_inputs;
      new_input.appendChild(new_name);
      new_value = document.createElement("th");
        new_value_input = document.createElement("input");
        new_value_input.setAttribute("type","text");
        new_value_input.setAttribute("size","8");
        new_value_input.setAttribute("name","0D_input_"+n_inputs);
        new_value_input.setAttribute("id","0D_input_"+n_inputs);
        new_value.appendChild(new_value_input);
      new_input.appendChild(new_value);
      new_error = document.createElement("th");
        new_error_input = document.createElement("input");
        new_error_input.setAttribute("type","text");
        new_error_input.setAttribute("size","8");
        new_error_input.setAttribute("name","0D_error_"+n_inputs);
        new_error_input.setAttribute("id","0D_error_"+n_inputs);
        new_error.appendChild(new_error_input);
      new_input.appendChild(new_error);
      new_nparts = document.createElement("th");
        new_nparts_input = document.createElement("input");
        new_nparts_input.setAttribute("type","text");
        new_nparts_input.setAttribute("size","8");
        new_nparts_input.setAttribute("name","0D_nparts_"+n_inputs);
        new_nparts_input.setAttribute("id","0D_nparts_"+n_inputs);
        new_nparts.appendChild(new_nparts_input);
      new_input.appendChild(new_nparts);
  table.appendChild(new_input);
}
function reset_0D_input()
{
  n_inputs_tmp = parseInt(document.getElementById("0D_n_inputs").value);
  if (n_inputs_tmp == 0)
  {
    return;
  }
  document.getElementById("0D_n_inputs").value = 0;
  for (i=1 ; i<=n_inputs_tmp ; ++i)
  {
    add_0D_input();
  }
}
function remove_0D_input()
{
  n_inputs_tmp = parseInt(document.getElementById("0D_n_inputs").value);
  if (n_inputs_tmp == 0)
  {
    return;
  }else
  {
    n_inputs_tmp = n_inputs_tmp - 1;
    if (n_inputs_tmp == 0)
    {
      table = document.getElementById("0D_input_table");
      child = table.lastElementChild;  
      while (child)
      { 
          table.removeChild(child); 
          child = table.lastElementChild; 
      } 
    }else
    {
      table = document.getElementById("0D_input_table");
      child = table.lastElementChild;
      table.removeChild(child);
    }
  }
  document.getElementById("0D_n_inputs").value = n_inputs_tmp;
}











// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Upload functions
function fileChosen()
{
  // --- Make folder button visible
  document.getElementById("1D_comments").innerHTML="Please click to begin upload:";
  document.getElementById("upload_div").style.visibility="visible";
  document.getElementById("upload_button").style.visibility = "visible";
  document.getElementById("progressBar").style.visibility="visible";
}
function send_upload()
{
  document.getElementById("upload_button").style.visibility = "hidden";
  document.getElementById("1D_comments").innerHTML = "upload in progress...";

  var n_files = document.getElementById("fileToUpload").files.length;
  var formdata = new FormData();
  for (k=0;k<n_files;k++)
  {
    var file = document.getElementById("fileToUpload").files[k];
    formdata.append("fileToUpload[]", file);
  }
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "php/upload.php");
  ajax.send(formdata);
}
function progressHandler(event)
{
  var percent = (event.loaded / event.total) * 100;
  document.getElementById("progressBar").value = Math.round(percent);
  document.getElementById("progress_status").innerHTML = "upload in progress: " + Math.round(percent) + "%";
}
function completeHandler(event)
{
  document.getElementById("progress_status").innerHTML = "";
  document.getElementById("1D_comments").innerHTML=event.target.responseText;
  document.getElementById("progressBar").value = 0;
  document.getElementById("progressBar").style.visibility="hidden";
}
function errorHandler(event)
{
  document.getElementById("progress_status").innerHTML = "Upload Failed";
}
function abortHandler(event)
{
  document.getElementById("progress_status").innerHTML = "Upload Aborted";
}













// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Main run functions
function launch_main_run()
{
  show_waiting_div();
  document.getElementById("waiting_message").innerHTML="<br/>This will launch the Dakota job with your code.<br/>Are you sure you want to action this request?<br/>";
  action_specification = "main_run";
}











// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Cookie functions
function setCookie(cname, cvalue, exdays)
{ 
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname)
{   
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    { 
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}














// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Debug functions

function debug()
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "php/image_registry.php?action=remove_image&image=random/image:latest", false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

