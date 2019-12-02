
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

  // --- Check if we have Code containers running
  code_containers = get_code_containers();
  selector = document.getElementById("container_selector");
  for (i=0 ; i<code_containers.length ; ++i)
  {
    name_tmp = code_containers[i].split("___");
    name = name_tmp[1]+"/"+name_tmp[2]+":"+name_tmp[3];
    new_container = document.createElement('option');
    new_container.setAttribute("value",name);
    new_container.innerHTML = name;
    selector.appendChild(new_container);
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
  document.getElementById("waiting_div").style.height="40%";
  document.getElementById("waiting_gif").style.visibility="hidden";
}
function hide_waiting_div()
{
  document.getElementById("waiting_div").style.visibility="hidden";
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
    document.getElementById(output_destination).innerHTML = output;
    return;
  }
}




// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --------------------------------------------------------------------
// --- Action wrapper which will be launched by the waiting-div action button and depends on the global variable "action_specification" to be set before call
function action_wrapper()
{
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
  if (action_specification == "launch_code")
  { 
    Docker_username   = document.getElementById("Docker_username").value;
    Docker_repository = document.getElementById("Docker_repository").value;
    Docker_tag        = document.getElementById("Docker_tag").value;
    container_name = "DAKOTA_CODE_CONTAINER___"+Docker_username+"___"+Docker_repository+"___"+Docker_tag;
    code_id = get_code_container_id(container_name);
    if (code_id != "")
    {
      execute_command("docker rm -f "+code_id);
    }
    document.getElementById("waiting_gif").style.visibility="visible";
    document.getElementById("waiting_message").innerHTML="<br/>Please wait while your code image is retrieved and launched.<br/>This may take a moment depending on the image size...<br/>";
    form = document.getElementById("new_container_form");
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
function launch_code_container()
{
  // --- First check that there isn't a Dakota container already running
  Docker_username   = document.getElementById("Docker_username").value;
  Docker_repository = document.getElementById("Docker_repository").value;
  Docker_tag        = document.getElementById("Docker_tag").value;
  container_name = "DAKOTA_CODE_CONTAINER___"+Docker_username+"___"+Docker_repository+"___"+Docker_tag;
  code_id = get_code_container_id(container_name);
  if (code_id != "")
  {
    show_waiting_div();
    document.getElementById("waiting_message").innerHTML="<br/>WARNING: you already have a container running for:"
                                                        +"<br/>"+Docker_username+"/"+Docker_repository+":"+Docker_tag+"<br/>"
                                                        +"<br/>This will remove it and download a new image to relaunch it."
                                                        +"<br/>Any dakota instances running using that container will be lost."
                                                        +"<br/>Are you sure you want to action this request?<br/>";
    action_specification = "launch_code";
  }else
  // --- Launch a new container
  {
    show_waiting_div();
    document.getElementById("waiting_message").innerHTML="<br/>This will launch a container for your code in the background.<br/>Are you sure you want to action this request?<br/>";
    action_specification = "launch_code";
  }
}
function get_code_containers()
{
  // --- Get containers using our flag name DAKOTA_CODE_CONTAINER
  containers = execute_command('docker ps -af "name=DAKOTA_CODE_CONTAINER" --filter status=running --format "{{.ID}}:::%%%:::{{.Names}}"');
  output = [];
  if (containers != "")
  { 
    containers = containers.split("\n");
    for (i=0; i < containers.length; ++i)
    { 
      if (containers[i] != "")
      { 
        name_tmp = containers[i];
        name_tmp = name_tmp.split(":::%%%:::");
        name = name_tmp[1];
        output.push(name);
      }
    }
  }
  return output;
}
function get_code_container_id(container_name)
{
  // --- Get containers using our flag name DAKOTA_CODE_CONTAINER
  command = 'docker ps -af "name='+container_name+'" --filter status=running --format "{{.ID}}"';
  container = execute_command(command);
  return container;
}   
function container_select(selected_option)
{
  document.getElementById("new_container_form").style.visibility="hidden";
  if (selected_option.value == "new_container")
  {
    document.getElementById("new_container_form").style.visibility="visible";
  }else
  {
    if (selected_option.value != "select_container")
    {
      document.getElementById("container_comments").innerHTML="Selected container:<br/>"+selected_option.value;
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













